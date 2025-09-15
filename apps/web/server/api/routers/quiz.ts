import { z } from "zod";

import { quizSubmitMutation } from "@/lib/mutations/quiz";
import { QuizWithVersion } from "@/lib/types/quiz";
import { GenerateUUID } from "@/lib/uuid";
import { createTRPCRouter, publicProcedure } from "../trpc";

const quizInclude = {};

export const quizRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ quizId: z.string() })).query(async ({ input, ctx }): Promise<QuizWithVersion | null> => {
    const quiz = await ctx.db.quiz.findFirst({
      where: { objectGuid: input.quizId, isDeleted: false },
      include: quizInclude,
    });
    if (!quiz) return null;

    const recentQuizVersion = await ctx.db.quizVersion.findFirst({
      where: { quizId: quiz.id },
      orderBy: { createdAt: "desc" },
    });
    if (!recentQuizVersion) return null;

    const quizWithVersion: QuizWithVersion = {
      ...quiz,
      version: recentQuizVersion,
    };

    return quizWithVersion;
  }),
  getBySlug: publicProcedure
    .input(z.object({ quizSlug: z.string(), published: z.boolean().default(false) }))
    .query(async ({ input, ctx }): Promise<QuizWithVersion | null> => {
      const quiz = await ctx.db.quiz.findFirst({
        where: { slug: input.quizSlug, published: input.published, isDeleted: false },
        include: quizInclude,
      });
      if (!quiz) return null;

      const recentQuizVersion = await ctx.db.quizVersion.findFirst({
        where: { quizId: quiz.id },
        orderBy: { createdAt: "desc" },
      });
      if (!recentQuizVersion) return null;

      const quizWithVersion: QuizWithVersion = {
        ...quiz,
        version: recentQuizVersion,
      };

      return quizWithVersion;
    }),
  submitQuiz: publicProcedure.input(quizSubmitMutation).mutation(async ({ input, ctx }) => {
    const { quizId, answers, score, resultRangeId } = input;

    const quiz = await ctx.db.quiz.findFirst({
      where: { objectGuid: quizId },
      include: quizInclude,
    });
    if (!quiz) return null;

    const recentQuizVersion = await ctx.db.quizVersion.findFirst({
      where: { quizId: quiz.id },
      orderBy: { createdAt: "desc" },
    });
    if (!recentQuizVersion) return null;

    const quizSubmissionGuid = GenerateUUID();

    const quizSubmission = await ctx.db.quizSubmission.create({
      data: {
        objectGuid: quizSubmissionGuid,
        answers,
        score,
        resultRangeId,
        quizVersion: { connect: { id: recentQuizVersion.id } },
      },
    });
    if (!quizSubmission) return null;

    return quiz;
  }),
});