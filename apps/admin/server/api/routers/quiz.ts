import { z } from "zod";

import { LogActivity } from "@/actions/activity";
import { LogError } from "@/actions/error";
import auth from "@/lib/auth";
import { required } from "@/lib/mutations/generic";
import { quizCreateMutation, quizEditMutation } from "@/lib/mutations/quiz";
import { GenerateUUID } from "@/lib/uuid";
import type { QuestionCategory, Quiz, ResultRange } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "../trpc";

const quizInclude = {
}

export const quizRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ quizId: z.string()}))
    .query(async ({ input, ctx }): Promise<Quiz | null> => {
      const session = await auth.api.getSession(ctx);
      if (!session || !session.user) {
        throw new Error("Unauthorized: user not found");
      }
      // const userId = session.user.id;

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
      const session = await auth.api.getSession(ctx);
      if (!session || !session.user) {
        throw new Error("Unauthorized: user not found");
      }
      // const userId = session.user.id;

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
  createQuiz: publicProcedure
    .input(quizCreateMutation)
    .mutation(async ({ input, ctx }) => {
      const session = await auth.api.getSession(ctx);
      if (!session || !session.user) {
        throw new Error("Unauthorized: user not found");
      }
      const userId = session.user.id;

      const { title, slug,description, questionCategories, resultRanges, published } = input

      const quizGuid = GenerateUUID();
      const quizQuestions: QuestionCategory[] = questionCategories.map(( questCat ) => {
        const questCatGuid = GenerateUUID();
        
        return {
          objectGuid: questCatGuid,
          slug: questCat.slug,
          description: questCat.description || "",
          label: questCat.label,
          sortOrder: questCat.sortOrder,
          questions: questCat.questions.map((q) => {
            const questGuid = GenerateUUID();

            return {
              objectGuid: questGuid,
              slug: q.slug,
              text: q.text,
              category: questCatGuid,
              quizId: quizGuid,
              sortOrder: q.sortOrder,

              options: q.options.map((opt) => {
                const optGuid = GenerateUUID();

                return {
                  objectGuid: optGuid,
                  slug: opt.slug,
                  text: opt.text,
                  points: opt.points,
                  sortOrder: opt.sortOrder,
                  questionId: questGuid,
                }
              })
            }
          })
        }
      })

      const quizResultRanges: ResultRange[] = resultRanges.map((resRang) => {
        const resRangGuid = GenerateUUID();

        return {
          objectGuid: resRangGuid,
          slug: resRang.slug,
          label: resRang.label,
          url: resRang.url,
          min: resRang.min,
          max: resRang.max,
          quizId: quizGuid,
        }
      });

      const quiz = await ctx.db.quiz.create({
        data: {
          objectGuid: quizGuid,
          title,
          slug,
          description,
          questionCategories: quizQuestions,
          resultRanges: quizResultRanges,
          published,
          createdBy: userId
        },
        include: quizInclude,
      });

      if (!quiz) {
        const error = `Could not create quiz.`;
        await LogError({ctx, sessionId: input.sessionId, error, data: input, resource: `quiz:create_quiz`, status: "500" })
        return null
      };
      
      // Save history snapshot
      await ctx.db.quizHistory.create({
        data: {
          objectGuid: GenerateUUID(),
          quizId: quiz.id,
          action: "CREATED",
          snapshot: quiz,
          actorId: userId
        }
      });

      const activityDescription = `Successfully created quiz`;
      await LogActivity({ctx, sessionId: input.sessionId, description:activityDescription, data: input, actionType: "quiz:create_quiz", onlyAdmin: true })

      return quiz;
    }),
    editQuiz: publicProcedure
      .input(quizEditMutation)
      .mutation(async ({ input, ctx }) => {
        const session = await auth.api.getSession(ctx);
        if (!session || !session.user) {
          throw new Error("Unauthorized: user not found");
        }
        const userId = session.user.id;

        const { quizId, title, slug, description, questionCategories, resultRanges, published } = input;
        
        let questionCounter = 0;

        const quiz = await ctx.db.quiz.findFirst({
          where: { objectGuid: quizId },
        });
        if (!quiz) {
          const error = `Could not find quiz.`;
          await LogError({ ctx, sessionId: input.sessionId, error, data: input, resource: `quiz:edit_quiz`, status: "404" });
          return null;
        }

        const quizQuestions: QuestionCategory[] = questionCategories.map((questCat) => {
          const questCatGuid = questCat.objectGuid || GenerateUUID();

          return {
            objectGuid: questCatGuid,
            slug: questCat.slug,
            description: questCat.description || "",
            sortOrder: questCat.sortOrder,
            label: questCat.label,
            questions: questCat.questions.map((q) => {
              const questGuid = q.objectGuid || GenerateUUID();
              questionCounter++;

              return {
                objectGuid: questGuid,
                slug: `question-${questionCounter}`,
                text: q.text,
                category: questCatGuid,
                sortOrder: q.sortOrder,
                quizId: quiz.objectGuid,

                options: q.options.map((opt) => {
                  const optGuid = opt.objectGuid || GenerateUUID();
                  return {
                    objectGuid: optGuid,
                    slug: opt.slug,
                    text: opt.text,
                    points: opt.points,
                    sortOrder: opt.sortOrder,
                    questionId: questGuid,
                  }
                }),
              }
            }),
          }
        });

        const quizResultRanges: ResultRange[] = resultRanges.map((resRang) => {
          const resRangGuid = resRang.objectGuid || GenerateUUID();

          return {
            objectGuid: resRangGuid,
            slug: resRang.slug,
            label: resRang.label,
            url: resRang.url,
            min: resRang.min,
            max: resRang.max,
            quizId: quiz.objectGuid,
          }
        });

        const updatedQuiz = await ctx.db.quiz.update({
          where: { id: quiz.id },
          data: {
            title,
            slug,
            description,
            questionCategories: quizQuestions,
            resultRanges: quizResultRanges,
            published,
            updatedBy: userId
          },
          include: quizInclude,
        });

        if (!updatedQuiz) {
          const error = `Could not update quiz.`;
          await LogError({ctx, sessionId: input.sessionId, error, data: input, resource: `quiz:edit_quiz`, status: "500" })
          return null
        };

        // Save history snapshot
        await ctx.db.quizHistory.create({
          data: {
            objectGuid: GenerateUUID(),
            quizId: updatedQuiz.id,
            action: "UPDATED",
            snapshot: updatedQuiz,
            actorId: userId
          }
        });

        const activityDescription = `Successfully updated quiz`;
        await LogActivity({ctx, sessionId: input.sessionId, description:activityDescription, data: input, actionType: "quiz:edit_quiz", onlyAdmin: true })

        return updatedQuiz;
      }),
    togglePublishQuiz: publicProcedure
      .input(z.object({...required,
        quizId: z.string(), publishToggle: z.boolean()
      }))
      .mutation(async ({ input, ctx }) => {
        const session = await auth.api.getSession(ctx);
        if (!session || !session.user) {
          throw new Error("Unauthorized: user not found");
        }
        const userId = session.user.id;

        const { quizId, publishToggle } = input;
        
        const quiz = await ctx.db.quiz.update({
          where: { id: quizId },
          data: {
            published: publishToggle,
            updatedBy: userId
          },
          include: quizInclude,
        });

        if (!quiz) {
          const error = `Could not ${publishToggle ? "publish" : "unpublish"} quiz.`;
          await LogError({ctx, sessionId: input.sessionId, error, data: input, resource: `quiz:toggle_publish_quiz`, status: "500" })
          return null
        };

        // Save history snapshot
        await ctx.db.quizHistory.create({
          data: {
            objectGuid: GenerateUUID(),
            quizId: quiz.id,
            action: "UPDATED",
            snapshot: quiz,
            actorId: userId
          }
        });

        const activityDescription = `Successfully ${publishToggle ? "published" : "unpublished"} quiz`;
        await LogActivity({ctx, sessionId: input.sessionId, description:activityDescription, data: input, actionType: "quiz:toggle_publish_quiz", onlyAdmin: true })

        return quiz;
      }),
})