import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

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
      const { input } = req;
      const url = "https://oauth.reddit.com/api/v1/me/prefs";

      console.log("&^^^^^^^^^^^^^^^^^^^ REQ EXAMPLE");
      console.log(url);
      console.log(input);

      const response = await fetch(url, {
        headers: {
          Authorization: `bearer ${input}`,
        },
      });

      console.log("_________________________RES____________________________");
      console.log(response);

      return response.json();
    }),
});
