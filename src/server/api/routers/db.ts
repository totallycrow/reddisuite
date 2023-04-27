import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { getSubredditRequirements } from "../../../services/reddit";

export const dbRouter = createTRPCRouter({
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

        return response.json();
      } catch (error) {
        throw error;
      }
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  test: publicProcedure.query(() => {
    return "test1";
  }),
});
