import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  addPostToDb,
  getSubredditRequirements,
  submitPost,
} from "../../../services/reddit";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export const redditRouter = createTRPCRouter({
  // ************************************************************
  getSubreddit: publicProcedure
    .input(z.object({ sub: z.string() }))
    .query(async (req) => {
      // const token = req.input.token;

      const { ctx } = req;
      const token = ctx.session?.user.token;

      if (!token) throw new Error("Invalid Token");
      return await getSubredditRequirements(token, req.input.sub);
    }),

  // ************************************************************

  getUserPosts: publicProcedure.query(async (req) => {
    // const token = req.input.token;

    const { ctx } = req;
    const token = ctx.session?.user.token;
    const redditUser = ctx.session?.user.redditId;

    const list = await ctx.prisma.redditPost.findMany({
      where: {
        redditAuthorId: redditUser,
      },
    });

    if (!token) throw new Error("Invalid Token");
    return list;
  }),
  removePostFromSchedule: publicProcedure
    .input(z.object({ internalId: z.string() }))
    .mutation(async (req) => {
      // const token = req.input.token;

      const { ctx } = req;
      const token = ctx.session?.user.token;
      const redditUser = ctx.session?.user.redditId;

      const post = await ctx.prisma.redditPost.delete(
        {
          where: {
            id: req.input.internalId,
          },
        }
        //
        // REMOVE FROM CRON
      );

      const date = post.SubmissionDate;

      const dateFormatted = new Date(Number(date));

      const minutes = dateFormatted.getMinutes();
      const hours = dateFormatted.getHours();
      const days = dateFormatted.getDate();
      const months = dateFormatted.getMonth() + 1;
      const dayOfWeek = dateFormatted.getDay();

      const cronString = `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;

      const secret = process.env.API_SECRET;

      const cronReq = `https://www.easycron.com/rest/add?token=fad86873a0a32c6def17481c4fce71b0&cron_expression=${cronString}&url=https%3A%2F%2Freddisuite.vercel.app%2Fapi%2Fsubmit&http_method=POST&http_message_body={"secret": "${secret}", "redditPostIds": ["${id}"]}&http_headers=Content-Type:application/json`;

      const cronList = await axios.get(
        "https://www.easycron.com/rest/list?token=fad86873a0a32c6def17481c4fce71b0"
      );

      const cronJobs = cronList.data.cron_jobs;

      console.log("????????????????????????????????");
      console.log("????????????????????????????????");
      console.log("????????????????????????????????");
      console.log("????????????????????????????????");

      console.log(cronJobs);

      const matchingCronJob = cronJobs.find(
        (cron) => cron.cron_expression === cronString
      );

      let previousPayload = await JSON.parse(
        matchingCronJob.http_message_body
      );

      console.log(previousPayload);

      const filteredData = previousPayload.redditPostIds.filter((id) => id !== req.input.internalId)

      
      previousPayload.redditPostIds = filteredData

      const jsonPayload = JSON.stringify(previousPayload);

      console.log(previousPayload);

      // EDIT THE CRON JOB BY ID

      const res = await axios.get(
        `https://www.easycron.com/rest/edit?token=fad86873a0a32c6def17481c4fce71b0&id=${matchingCronJob.cron_job_id}&http_message_body=${jsonPayload}`
      );
      console.log(res);
    }



      if (!token) throw new Error("Invalid Token");
      return post;
    }),

  // ************************************************************
  // ************************************************************

  sendPost: publicProcedure
    .input(
      z.object({
        title: z.string(),
        link: z.string(),
        sub: z.string(),
        flair: z.string(),
        date: z.number(),
        isScheduler: z.boolean(),
      })
    )
    .mutation(async (req) => {
      const { ctx } = req;
      const { title, link, sub, flair, date, isScheduler } = req.input;

      const token = ctx.session?.user.token;
      const userId = ctx.session?.user.id;
      const redditId = ctx.session?.user.redditId;

      if (!token) throw new Error("Invalid Token");

      const parambody = new URLSearchParams({
        ad: "false",
        api_type: "json",
        app: "test",
        extension: "json",
        sr: sub,
        title: title,
        url: link,
        kind: "link",
        resubmit: "true",
        nsfw: "false",
        flair_id: flair,
      });
      try {
        console.log("_________________________RES____________________________");

        // export interface ISubmissionResponse {
        //   json: ISubmissionResponseJson;
        // }

        // export interface ISubmissionResponseJson {
        //   errors: string[];
        //   data: ISubmissionResponseData;
        // }

        if (!isScheduler) {
          const result = await submitPost<ISubmissionResponse>(
            token,
            sub,
            link,
            title,
            flair
          );

          const isOK = result.json.errors.length === 0;

          const dbresponse = await addPostToDb(
            result.json.data.id || String(Date.now()),
            redditId,
            title,
            link,
            sub,
            isOK,
            date,
            flair,
            isScheduler
          );

          console.log("################ DB ################");
          console.log(dbresponse);

          return result;
          // return response.json();
        }

        // set dummy id until submission time and getting actual reddit id
        const id = uuidv4() as string;

        const dbresponse = await addPostToDb(
          id,
          redditId,
          title,
          link,
          sub,
          false,
          date,
          flair,
          isScheduler
        );

        // ADD CRON

        const dateFormatted = new Date(date);

        const minutes = dateFormatted.getMinutes();
        const hours = dateFormatted.getHours();
        const days = dateFormatted.getDate();
        const months = dateFormatted.getMonth() + 1;
        const dayOfWeek = dateFormatted.getDay();

        const cronString = `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;

        const secret = process.env.API_SECRET;

        // check if date exisits for any cronjob

        // JSON FORMAT FOR CRON DATA
        /* 
        
        {
          secret: DSAHJDSHDJSA
          redditPostIds: []
        }        
        */

        const cronReq = `https://www.easycron.com/rest/add?token=fad86873a0a32c6def17481c4fce71b0&cron_expression=${cronString}&url=https%3A%2F%2Freddisuite.vercel.app%2Fapi%2Fsubmit&http_method=POST&http_message_body={"secret": "${secret}", "redditPostIds": ["${id}"]}&http_headers=Content-Type:application/json`;

        const cronList = await axios.get(
          "https://www.easycron.com/rest/list?token=fad86873a0a32c6def17481c4fce71b0"
        );

        const cronJobs = cronList.data.cron_jobs;

        console.log("????????????????????????????????");
        console.log("????????????????????????????????");
        console.log("????????????????????????????????");
        console.log("????????????????????????????????");

        console.log(cronJobs);

        const matchingCronJob = cronJobs.find(
          (cron) => cron.cron_expression === cronString
        );

        console.log("????????????????????????????????");
        console.log("MATCHING DATE");
        console.log("MATCHING DATE");
        console.log("MATCHING DATE");
        console.log("MATCHING DATE");
        console.log("MATCHING DATE");
        console.log("MATCHING DATE");
        console.log(matchingCronJob);

        // CHECK IF EXISTS IF NOT ADD SINGLE CRON ELSE MODIFY PAYLOAD

        console.log("????????????????????????????????");
        console.log(cronReq);

        if (matchingCronJob === undefined) {
          const res = await axios.get(cronReq);
          console.log(res);

          console.log(cronString);
          console.log("????????????????????????????????");
          console.log("NO MATCH FOUND, ADDED NEW CRON");
          //
          //
        } else {
          console.log("__________________________________-");
          console.log("!!!!!!!!!!!!!!!!!!!!");
          console.log("DUPLICATE");

          let previousPayload = await JSON.parse(
            matchingCronJob.http_message_body
          );

          console.log(previousPayload);

          previousPayload.redditPostIds = [
            ...previousPayload.redditPostIds,
            id,
          ];

          const jsonPayload = JSON.stringify(previousPayload);

          console.log(previousPayload);

          // EDIT THE CRON JOB BY ID

          const res = await axios.get(
            `https://www.easycron.com/rest/edit?token=fad86873a0a32c6def17481c4fce71b0&id=${matchingCronJob.cron_job_id}&http_message_body=${jsonPayload}`
          );
          console.log(res);
        }
        // console.log(res);

        return {
          json: {
            errors: [],
            data: dbresponse,
          },
        };
      } catch (error) {
        throw error;
      }
    }),

  // ************

  // ************************************************************************************************************************
  // ************************************************************************************************************************
  // ************************************************************************************************************************
  // ************************************************************************************************************************
  // ************************************************************************************************************************
  // ************************************************************************************************************************

  // getToken: protectedProcedure.query(({ ctx }) => {
  //   return ctx.prisma.account.findUnique({
  //     where: {
  //       id: "cldsvs6b200033jkhea941akw",
  //     },
  //     select: {
  //       access_token: true,
  //     },
  //   });
  // }),

  // test2: publicProcedure
  //   .input((val: unknown) => {
  //     // If the value is of type string, return it.
  //     // TypeScript now knows that this value is a string.
  //     if (typeof val === "string") return val;

  //     // Uh oh, looks like that input wasn't a string.
  //     // We will throw an error instead of running the procedure.
  //     throw new Error(`Invalid input: ${typeof val}`);
  //   })
  //   .query(async (req) => {
  //     const { input, ctx } = req;

  //     const token = ctx.session?.user.token;
  //     if (!token) throw new Error("Invalid Token");

  //     const url = "https://oauth.reddit.com/api/v1/me/prefs";

  //     console.log("&^^^^^^^^^^^^^^^^^^^ REQ EXAMPLE");
  //     console.log(url);
  //     console.log(input);

  //     const response = await fetch(url, {
  //       headers: {
  //         Authorization: `bearer ${token}`,
  //       },
  //     });

  //     console.log("_________________________RES____________________________");
  //     console.log(response);

  //     // versje noda
  //     // below will be done in the same request when batching is enabled
  //     // const somePosts = await Promise.all([
  //     //   client.query('post.byId', 1),
  //     //   client.query('post.byId', 2),
  //     //   client.query('post.byId', 3),
  //     // ]);

  //     return response.json();
  //   }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  test: publicProcedure.query(() => {
    return "test1";
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
