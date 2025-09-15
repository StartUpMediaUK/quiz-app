import { z } from "zod";

import auth from "@/lib/auth";
import { ErrorLog } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "../trpc";

const errorLogInclude = {};

export const errorLogRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ errorLogId: z.string(), }))
    .query(async ({ input, ctx }): Promise<ErrorLog | null> => {
      const session = await auth.api.getSession(ctx);
      if (!session?.user) throw new Error("Unauthorized: user not found");

      const errorLog = await ctx.db.errorLog.findFirst({
        where: { objectGuid: input.errorLogId, isDeleted: false },
        include: errorLogInclude,
      });
      if (!errorLog) return null;

      return errorLog;
    }),
  getAll: publicProcedure
    .input(z.object({ }))
    .query(async ({ input, ctx }): Promise<ErrorLog[]> => {
      const session = await auth.api.getSession(ctx);
      if (!session?.user) throw new Error("Unauthorized: user not found");

      const errorLogs = await ctx.db.errorLog.findMany({
        where: { isDeleted: false },
        take: 20,
      });

      return errorLogs;
    }),
});