import auth from "@/lib/auth";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { headers } from "next/headers";

export const currentUserRouter = createTRPCRouter({
  getCurrentUser: publicProcedure
    .query(async ({ }) => {
      const session = await auth.api.getSession({
        headers: await headers()
      })
      return session?.user;

    }),
});
