import { z } from "zod";

import auth from "@/lib/auth";
import { SubmissionWithQuizVersion } from "@/lib/types/quiz";
import { createTRPCRouter, publicProcedure } from "../trpc";

const submissionInclude = {
  quizVersion: { include: { quiz: true }}
};

export const submissionRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ submissionId: z.string() })).query(async ({ input, ctx }): Promise<SubmissionWithQuizVersion | null> => {
    const session = await auth.api.getSession(ctx);
    if (!session || !session.user) {
      throw new Error("Unauthorized: user not found");
    }

    const submission = await ctx.db.quizSubmission.findFirst({
      where: { objectGuid: input.submissionId },
      include: submissionInclude,
    });
    if (!submission) return null;

    return submission;
  }),
  getAll: publicProcedure.input(z.object({})).query(async ({ ctx }): Promise<SubmissionWithQuizVersion[]> => {
    const session = await auth.api.getSession(ctx);
    if (!session || !session.user) {
      throw new Error("Unauthorized: user not found");
    }

    const submissions = await ctx.db.quizSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: submissionInclude,
    });

    return submissions;
  }),
});