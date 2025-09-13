import { z } from "zod";

import type { Quiz } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "../trpc";

const quizInclude = {
}

export const quizRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ quizId: z.string()}))
    .query(async ({ input, ctx }): Promise<Quiz | null> => {
      const quiz = await ctx.db.quiz.findFirst({
        where: { objectGuid: input.quizId, isDeleted: false },
        include: quizInclude,
      });

      if (!quiz) return null;

      return quiz;
    }),
  getBySlug: publicProcedure
    .input(z.object({ quizSlug: z.string(), published: z.boolean().default(false)}))
    .query(async ({ input, ctx }): Promise<Quiz | null> => {
      const quiz  = await ctx.db.quiz.findFirst({
        where: { slug: input.quizSlug, published: input.published, isDeleted: false },
        include: quizInclude,
      });

      if (!quiz) return null;

      return quiz;
    }),
  getAll: publicProcedure
    .input(z.object({
    }))
    .query(async ({ ctx }): Promise<Quiz[]> => {
      const quizzes = await ctx.db.quiz.findMany({
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      return quizzes;
    }),
})