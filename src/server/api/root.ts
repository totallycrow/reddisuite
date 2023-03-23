import { createTRPCRouter } from "./trpc";
import { redditRouter } from "./routers/reddit";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  reddit: redditRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
