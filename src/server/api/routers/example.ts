import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { getSubredditRequirements } from "../../../services/reddit";


// axios<{prefs:[]}>

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

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  getToken: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.account.findUnique({
      where: {
        id: "cldsvs6b200033jkhea941akw",
      },
      select: {
        access_token: true,
      },
    });
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  test: publicProcedure.query(() => {
    return "test1";
  }),
  test2: publicProcedure
    .input((val: unknown) => {
      // If the value is of type string, return it.
      // TypeScript now knows that this value is a string.
      if (typeof val === "string") return val;

      // Uh oh, looks like that input wasn't a string.
      // We will throw an error instead of running the procedure.
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query(async (req) => {
      const { input, ctx } = req;

      // D
      const token = ctx.session?.user.token;
      if (!token) throw new Error("Invalid Token");

      const url = "https://oauth.reddit.com/api/v1/me/prefs";

      console.log("&^^^^^^^^^^^^^^^^^^^ REQ EXAMPLE");
      console.log(url);
      console.log(input);

      const response = await fetch(url, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

      console.log("_________________________RES____________________________");
      console.log(response);

      // versje noda
      // below will be done in the same request when batching is enabled
      // const somePosts = await Promise.all([
      //   client.query('post.byId', 1),
      //   client.query('post.byId', 2),
      //   client.query('post.byId', 3),
      // ]);

      return response.json();
    }),

  // ************************************************************
  // ************************************************************
  // ************************************************************

  getSubreddit: publicProcedure
    .input(z.object({ sub: z.string() }))
    .query(async (req) => {
      // const token = req.input.token;
      console.log(
        "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
      );

      const { input, ctx } = req;
      const token = ctx.session?.user.token;
      if (!token) throw new Error("Invalid Token");

      // const url = `https://oauth.reddit.com//r/${req.input.sub}/api/link_flair`;
      const url = `https://oauth.reddit.com/api/v1/${req.input.sub}/post_requirements`;
      console.log("&^^^^^^^^^^^^^^^^^^^ REQ EXAMPLE");
      console.log(url);

      const response = await fetch(url, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

      console.log("_________________________RES____________________________");
      console.log(response);
      // console.log(response.status);
      // console.log(response.status === 200);
      // let subData: unknown;

      // const subredditData = (await response.json()) as unknown;

      const TEST_DATA = await getSubredditRequirements(token, req.input.sub);

      console.log("TEST DATA _____________________ TEST SERVICES");
      console.log(TEST_DATA);

      console.log("*****");
      // console.log(subredditData);

      // if (response.status === 200) {
      //   subData = response.json();
      //   return subData as ISubredditInfo;
      // }

      // console.log(typeof subData);

      // *************************** TODO? *************************************
      // ??????????????
      // Check response

      // See if title tags and flairs required?
      // run subsequent fetches -> fetch flair ids+names and required title tags
      // combine responses and return complete subreddit object?

      // fetch FinalizationRegistryf
      // fetch title

      // return subData;

      return TEST_DATA;
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
      if (!token) throw new Error("Invalid Token");

      // https://www.reddit.com/api/v1/

      console.log("&^^^^^^^^^^^^^^^^^^^ REQ EXAMPLE");
      console.log(url);
      // console.log(input);

      // const parambody = new URLSearchParams({
      //   ad: "false",
      //   api_type: "json",
      //   app: "test",

      //   sr: "test",
      //   title: "test",
      //   text: "test",
      //   kind: "self",
      //   resubmit: "false",
      //   nsfw: "false",
      // });

      // npm install snoowrap
      // npm install @types/snoowrap

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

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: parambody,
      });

      console.log("_________________________RES____________________________");
      console.log(response);

      // versje noda

      return response.json();
    }),
});

// /api/v1/subreddit/post_requirements
