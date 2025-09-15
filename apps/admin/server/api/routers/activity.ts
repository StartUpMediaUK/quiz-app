import { z } from "zod";

import auth from "@/lib/auth";
import { Activity } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "../trpc";

const activityInclude = {};

export const activityRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ activityId: z.string(), }))
    .query(async ({ input, ctx }): Promise<Activity | null> => {
      const session = await auth.api.getSession(ctx);
      if (!session?.user) throw new Error("Unauthorized: user not found");

      const activity = await ctx.db.activity.findFirst({
        where: { objectGuid: input.activityId, isDeleted: false },
        include: activityInclude,
      });
      if (!activity) return null;

      return activity;
    }),
  getAll: publicProcedure
    .input(z.object({ }))
    .query(async ({ input, ctx }): Promise<Activity[]> => {
      const session = await auth.api.getSession(ctx);
      if (!session?.user) throw new Error("Unauthorized: user not found");

      const activities = await ctx.db.activity.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      return activities;
    }),
});