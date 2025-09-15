import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { activityRouter } from "./routers/activity";
import { currentUserRouter } from "./routers/current-user";
import { errorLogRouter } from "./routers/errorLog";
import { quizRouter } from "./routers/quiz";
import { submissionRouter } from "./routers/submission";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  quiz: quizRouter,
  activity: activityRouter,
  errorLog: errorLogRouter,
  submission: submissionRouter,
  currentUser: currentUserRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
