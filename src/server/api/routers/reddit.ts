import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  addPostToDb,
  getSubredditRequirements,
  submitPost,
} from "../../../services/reddit";
import { PrismaClient } from "@prisma/client";

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
  // ************************************************************
  // ************************************************************

  sendPost: publicProcedure
    .input(
      z.object({
        title: z.string(),
        link: z.string(),
        sub: z.string(),
        flair: z.string(),
      })
    )
    .mutation(async (req) => {
      const { ctx } = req;
      const { title, link, sub, flair } = req.input;
      const url = `https://oauth.reddit.com/api/submit`;

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

      console.log(
        "============================================================="
      );
      console.log(JSON.stringify(parambody));

      try {
        // const response = await fetch(url, {
        //   method: "POST",
        //   headers: {
        //     Authorization: `bearer ${token}`,
        //     "Content-Type": "application/x-www-form-urlencoded",
        //   },
        //   body: parambody,
        // });

        console.log("_________________________RES____________________________");
        const result = await submitPost<ISubmissionResponse>(
          token,
          sub,
          link,
          title,
          flair
        );

        // const res = await result;
        // console.log(res);

        console.log("_________________________RES____________________________");
        // console.log(response);

        // ************************************************************
        // ADD POST TO DATABASE?
        // ************************************************************

        // CHECK RESPONSE HERE OR FRONT? SUCCESS / ERROR

        // await ctx.prisma.redditPost.upsert({
        //   where: {
        //     redditPostId: "test",
        //   },
        //   update: {
        //     redditAuthorId: "test",
        //   },
        //   create: {
        //     redditPostId: "Test",
        //     title: "string",
        //     redditAuthorId: "test",
        //     url: "test",
        //     sub: "test",
        //     isSuccess: false,
        //     SubmissionDate: new Date(Date.now()),
        //   },
        // });

        const dbresponse = await addPostToDb(
          result.json.data.id || String(Date.now()),
          redditId,
          title,
          link,
          sub,
          true
        );

        console.log("################ DB ################");
        console.log(dbresponse);

        return result;
        // return response.json();
      } catch (error) {
        throw error;
      }
    }),

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
