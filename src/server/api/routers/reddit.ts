import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  addPostToDb,
  getSubredditRequirements,
  refreshToken,
  submitPost,
} from "../../../services/reddit";
import { v4 as uuidv4 } from "uuid";
import {
  addNewCronJob,
  editCronJob,
  generateCronDateString,
  getCronsList,
  getMatchingCronJobByCronString,
  removePostFromCronJob,
} from "../../../services/cron";

export const redditRouter = createTRPCRouter({
  // ************************************************************
  getSubreddit: publicProcedure
    .input(z.object({ sub: z.string() }))
    .query(async (req) => {
      const { ctx } = req;
      const token = ctx.session?.user.token;

      if (!token) throw new Error("Invalid Token");
      return await getSubredditRequirements(token, req.input.sub);
    }),
  // ************************************************************

  // ************************************************************
  getUserPosts: publicProcedure.query(async (req) => {
    const { ctx } = req;
    const token = ctx.session?.user.token;
    const redditUser = ctx.session?.user.redditId;

    if (!redditUser) throw new Error("Invalid User");

    const list = await ctx.prisma.redditPost.findMany({
      where: {
        redditAuthorId: redditUser,
      },
    });

    if (!token) throw new Error("Invalid Token");
    return list;
  }),
  // ************************************************************

  // ************************************************************
  removePostFromSchedule: publicProcedure
    .input(z.object({ internalId: z.string() }))
    .mutation(async (req) => {
      const { ctx } = req;

      const post = await ctx.prisma.redditPost.delete({
        where: {
          id: req.input.internalId,
        },
      });

      if (post.redditPostId === null) throw new Error("Invalid redditPostId");
      const date = post.SubmissionDate;

      const cronString = generateCronDateString(date);

      await removePostFromCronJob(cronString, post.redditPostId);
      return post;
    }),
  // ************************************************************

  // ********************************************************
  sendPost: publicProcedure
    .input(
      z.object({
        title: z.string(),
        link: z.string(),
        sub: z.string(),
        flair: z.string(),
        date: z.number(),
        isScheduler: z.boolean(),
        postId: z.string(),
      })
    )
    .mutation(async (req) => {
      const { ctx } = req;
      const { title, link, sub, flair, date, isScheduler, postId } = req.input;

      const token = ctx.session?.user.token;
      const redditId = ctx.session?.user.redditId;
      const expires_at = ctx.session?.user.expires_at;
      const refresh_token = ctx.session?.user.refresh_token;

      const submissionDate = Date.now();
      const scheduledDate = date;

      if (!token)
        return {
          json: {
            errors: "INVALID_TOKEN",
            data: {},
          },
        };

      if (
        refresh_token &&
        redditId &&
        expires_at &&
        expires_at <= Math.floor(new Date().getTime() / 1000.0)
      ) {
        await refreshToken(redditId, refresh_token);
      }

      // *****************************************************************************************
      if (!isScheduler) {
        const result = await submitPost(token, sub, link, title, flair);

        const isOK = result.json.errors.length === 0;

        if (!redditId) throw new Error("Invalid reddit ID");
        const dbresponse = await addPostToDb(
          result.json.data.id || String(Date.now()),
          redditId,
          title,
          link,
          sub,
          isOK,
          submissionDate,
          flair,
          isScheduler,
          submissionDate,
          true,
          "SUBMITTED WITHOUT SCHEDULER"
        );

        console.log("################ DB ################");
        console.log(dbresponse);

        return {
          json: {
            errors: "",
            data: dbresponse,
          },
        };
      }
      // *****************************************************************************************

      const isUpdate = postId !== "";
      const id = isUpdate ? postId : uuidv4();
      let responseResult = "";
      let responseStatus = "";

      // ADD NEW CRON
      // IF UPDATE, REMOVE ID FROM PREVIOUS CRON

      const cronString = generateCronDateString(date);
      const cronJobs = await getCronsList();

      // IS UPDATE? IF SO, REMOVE JOB FROM CURRENT CRON
      // ****************************************************
      if (isUpdate && cronJobs.length > 0) {
        const originalPost = await ctx.prisma.redditPost.findUnique({
          where: {
            redditPostId: postId,
          },
        });

        if (!originalPost || !originalPost.SubmissionDate)
          throw new Error("Invalid submission date");

        const cronStringOriginal = generateCronDateString(
          originalPost?.SubmissionDate
        );

        await removePostFromCronJob(cronStringOriginal, postId);
      }
      // *****************************************************************************************

      const matchingCronJob = await getMatchingCronJobByCronString(cronString);

      // CHECK IF EXISTS IF NOT ADD SINGLE CRON ELSE MODIFY PAYLOAD

      // CASE: DOESN'T EXIST -> CREATE CRON
      if (matchingCronJob === undefined) {
        const addCronResult = await addNewCronJob(cronString, id);
        const responseStatus = addCronResult.data.status;

        if (responseStatus !== "error") {
          responseResult = responseStatus;
        } else {
          if ("error" in addCronResult.data) {
            responseResult = addCronResult.data.error.message;
          }
        }

        // CASE: IT DOES EXIST -> UPDATE CRON
      } else {
        const jobEditResult = await editCronJob(matchingCronJob, id);

        console.log(jobEditResult);
        responseStatus = jobEditResult.data.status;
        if (responseStatus !== "error") {
          responseResult = jobEditResult.data.status;
        } else if ("error" in jobEditResult.data) {
          responseResult = jobEditResult.data.error.message;
        }
      }
      // *****************************************************************************************

      // ************* ADD NEW TO DB **************
      if (!redditId) throw new Error("invalid reddit ID");
      const dbresponse = await addPostToDb(
        id,
        redditId,
        title,
        link,
        sub,
        false,
        submissionDate,
        flair,
        isScheduler,
        date,
        false,
        "SCHEDULED OK"
      );

      if (responseStatus !== "error") {
        return {
          json: {
            errors: "",
            data: dbresponse,
          },
        };
      }
      return {
        json: {
          errors: responseResult,
          data: dbresponse,
        },
      };
    }),
});

export interface ISubredditInfo {
  title_regexes: string[];
  body_blacklisted_strings: string[];
  title_blacklisted_strings: string[];
  body_text_max_length: string | null;
  title_required_strings: string[];
  guidelines_text: string | null;
  gallery_min_items: string | null;
  domain_blacklist: string[];
  domain_whitelist: string[];
  title_text_max_length: string | null;
  body_restriction_policy: string;
  link_restriction_policy: string;
  guidelines_display_policy: string | null;
  body_required_strings: string[];
  title_text_min_length: string | null;
  gallery_captions_requirement: string;
  is_flair_required: true;
  gallery_max_items: string | null;
  gallery_urls_requirement: string;
  body_regexes: string[];
  link_repost_age: string | null;
  body_text_min_length: string | null;
}

export interface ISubmissionResponse {
  json: ISubmissionResponseJson;
}

export interface ISubmissionResponseJson {
  errors: string[];
  data: ISubmissionResponseData;
}

export interface ISubmissionResponseData {
  url: string;
  drafts_count: number;
  id: string;
  name: string;
}
