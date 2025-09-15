import { z } from "zod";

import { LogActivity } from "@/actions/activity";
import { LogError } from "@/actions/error";
import auth from "@/lib/auth";
import { required } from "@/lib/mutations/generic";
import { quizCreateMutation, quizEditMutation } from "@/lib/mutations/quiz";
import { QuizWithVersion } from "@/lib/types/quiz";
import { GenerateUUID } from "@/lib/uuid";
import type { QuestionCategory, ResultRange } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "../trpc";

const quizInclude = {};

export const quizRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ quizId: z.string(), versionId: z.string().optional().nullable() }))
    .query(async ({ input, ctx }): Promise<QuizWithVersion | null> => {
      const session = await auth.api.getSession(ctx);
      if (!session?.user) throw new Error("Unauthorized: user not found");

      const quiz = await ctx.db.quiz.findFirst({
        where: { objectGuid: input.quizId, isDeleted: false },
        include: quizInclude,
      });
      if (!quiz) return null;

      const version = input.versionId
        ? await ctx.db.quizVersion.findFirst({ where: { objectGuid: input.versionId } })
        : await ctx.db.quizVersion.findFirst({
            where: { quizId: quiz.id },
            orderBy: { createdAt: "desc" },
          });

      if (!version) return null;

      return { ...quiz, version };
    }),
  getBySlug: publicProcedure
    .input(z.object({ quizSlug: z.string(), versionId: z.string().optional().nullable(), published: z.boolean().default(false) }))
    .query(async ({ input, ctx }): Promise<QuizWithVersion | null> => {
      const session = await auth.api.getSession(ctx);
      if (!session || !session.user) {
        throw new Error("Unauthorized: user not found");
      }
      const quiz = await ctx.db.quiz.findFirst({
        where: { slug: input.quizSlug, published: input.published, isDeleted: false },
        include: quizInclude,
      });
      if (!quiz) return null;

      const version = input.versionId
        ? await ctx.db.quizVersion.findFirst({ where: { objectGuid: input.versionId } })
        : await ctx.db.quizVersion.findFirst({
            where: { quizId: quiz.id },
            orderBy: { createdAt: "desc" },
          });

      if (!version) return null;

      return { ...quiz, version };
    }),
  getAll: publicProcedure
    .input(z.object({ versionId: z.string().optional().nullable() }))
    .query(async ({ input, ctx }): Promise<QuizWithVersion[]> => {
      const session = await auth.api.getSession(ctx);
      if (!session?.user) throw new Error("Unauthorized: user not found");

      const quizzes = await ctx.db.quiz.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
      });

      const quizzesWithVersions: QuizWithVersion[] = [];

      for (const quiz of quizzes) {
        const version = input.versionId
          ? await ctx.db.quizVersion.findFirst({ where: { objectGuid: input.versionId } })
          : await ctx.db.quizVersion.findFirst({
              where: { quizId: quiz.id },
              orderBy: { createdAt: "desc" },
            });

        if (!version) continue; // Skip if no version exists

        quizzesWithVersions.push({
          ...quiz,
          version,
        });
      }

      return quizzesWithVersions;
    }),
  createQuiz: publicProcedure.input(quizCreateMutation).mutation(async ({ input, ctx }) => {
    const session = await auth.api.getSession(ctx);
    if (!session || !session.user) {
      throw new Error("Unauthorized: user not found");
    }
    const userId = session.user.id;

    const { title, slug, description, questionCategories, resultRanges, published } = input;

    const quizGuid = GenerateUUID();
    const quizVersionGuid = GenerateUUID();
    const quizQuestions: QuestionCategory[] = questionCategories.map((questCat) => {
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
              };
            }),
          };
        }),
      };
    });

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
      };
    });

    const quiz = await ctx.db.quiz.create({
      data: {
        objectGuid: quizGuid,
        slug,
        published,
        createdBy: userId,
      },
      include: quizInclude,
    });

    if (!quiz) {
      const error = `Could not create quiz.`;
      await LogError({ ctx, sessionId: input.sessionId, error, data: input, resource: `quiz:create_quiz`, status: "500" });
      return null;
    }

    const quizVersion = await ctx.db.quizVersion.create({
      data: {
        objectGuid: quizVersionGuid,
        title,
        description,
        questionCategories: quizQuestions,
        resultRanges: quizResultRanges,
        version: 1.0,
        createdBy: userId,
        quiz: { connect: { id: quiz.id } },
      },
    });

    if (!quizVersion) {
      const error = `Could not create quiz version.`;
      await LogError({ ctx, sessionId: input.sessionId, error, data: input, resource: `quiz:create_quiz`, status: "500" });
      return null;
    }

    const quizWithVersion: QuizWithVersion = {
      ...quiz,
      version: quizVersion,
    };
    // Save history snapshot
    await ctx.db.quizHistory.create({
      data: {
        objectGuid: GenerateUUID(),
        quizId: quizWithVersion.id,
        action: "CREATED",
        snapshot: quizWithVersion,
        actorId: userId,
      },
    });

    const activityDescription = `Successfully created quiz`;
    await LogActivity({
      ctx,
      sessionId: input.sessionId,
      description: activityDescription,
      data: input,
      actionType: "quiz:create_quiz",
      onlyAdmin: true,
    });

    return quizWithVersion;
  }),
  editQuiz: publicProcedure.input(quizEditMutation).mutation(async ({ input, ctx }) => {
    const session = await auth.api.getSession(ctx);
    if (!session || !session.user) {
      throw new Error("Unauthorized: user not found");
    }
    const userId = session.user.id;

    const { quizId, title, slug, description, questionCategories, resultRanges } = input;

    let questionCounter = 0;

    const quiz = await ctx.db.quiz.findFirst({
      where: { objectGuid: quizId },
      include: { versions: true },
    });
    if (!quiz) {
      const error = `Could not find quiz.`;
      await LogError({ ctx, sessionId: input.sessionId, error, data: input, resource: `quiz:edit_quiz`, status: "404" });
      return null;
    }

    const quizVersionGuid = GenerateUUID();
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
              };
            }),
          };
        }),
      };
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
      };
    });

    const updatedQuiz = await ctx.db.quiz.update({
      where: { id: quiz.id },
      data: {
        slug,
        published: quiz.published,
        updatedBy: userId,
      },
      include: quizInclude,
    });

    if (!updatedQuiz) {
      const error = `Could not update quiz.`;
      await LogError({ ctx, sessionId: input.sessionId, error, data: input, resource: `quiz:edit_quiz`, status: "500" });
      return null;
    }

    const latestVersionNumber = quiz.versions.length ? Math.max(...quiz.versions.map((v) => v.version)) : 0;
    const nextVersionNumber = latestVersionNumber + 1;
    const quizVersion = await ctx.db.quizVersion.create({
      data: {
        objectGuid: quizVersionGuid,
        title,
        description,
        questionCategories: quizQuestions,
        resultRanges: quizResultRanges,
        version: nextVersionNumber,
        createdBy: userId,
        quiz: { connect: { id: quiz.id } },
      },
    });

    if (!quizVersion) {
      const error = `Could not create quiz version.`;
      await LogError({ ctx, sessionId: input.sessionId, error, data: input, resource: `quiz:update_quiz`, status: "500" });
      return null;
    }

    const quizWithVersion: QuizWithVersion = {
      ...quiz,
      version: quizVersion,
    };

    // Save history snapshot
    await ctx.db.quizHistory.create({
      data: {
        objectGuid: GenerateUUID(),
        quizId: quizWithVersion.id,
        action: "UPDATED",
        snapshot: quizWithVersion,
        actorId: userId,
      },
    });

    const activityDescription = `Successfully updated quiz`;
    await LogActivity({
      ctx,
      sessionId: input.sessionId,
      description: activityDescription,
      data: input,
      actionType: "quiz:edit_quiz",
      onlyAdmin: true,
    });

    return updatedQuiz;
  }),
  togglePublishQuiz: publicProcedure
    .input(z.object({ ...required, quizId: z.string(), publishToggle: z.boolean() }))
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
          updatedBy: userId,
        },
        include: quizInclude,
      });

      if (!quiz) {
        const error = `Could not ${publishToggle ? "publish" : "unpublish"} quiz.`;
        await LogError({ ctx, sessionId: input.sessionId, error, data: input, resource: `quiz:toggle_publish_quiz`, status: "500" });
        return null;
      }

      // Save history snapshot
      await ctx.db.quizHistory.create({
        data: {
          objectGuid: GenerateUUID(),
          quizId: quiz.id,
          action: "UPDATED",
          snapshot: quiz,
          actorId: userId,
        },
      });

      const activityDescription = `Successfully ${publishToggle ? "published" : "unpublished"} quiz`;
      await LogActivity({
        ctx,
        sessionId: input.sessionId,
        description: activityDescription,
        data: input,
        actionType: "quiz:toggle_publish_quiz",
        onlyAdmin: true,
      });

      return quiz;
    }),
});