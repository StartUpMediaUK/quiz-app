import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";

export type CanvasDB = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

export interface CanvasDBQuery {
  db: CanvasDB;
}
