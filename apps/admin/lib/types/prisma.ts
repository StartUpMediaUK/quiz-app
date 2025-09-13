import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";

type PrismaContext = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
type ContextType = {headers: Headers; db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>}

export { };
export type {
  ContextType, PrismaContext
};

