import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma"; // Use Prisma for session and user storage
import { multiSession, openAPI } from "better-auth/plugins";

import { prismadb } from "@/server/db";

const auth = betterAuth({
  user: {
    modelName: "User",
  },
  session: {
    modelName: "Session",
  },
  account: {
    modelName: "Account",
  },
  verification: {
    modelName: "Verification",
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(_data, _request) {
      // Send an email to the user with a link to reset their password
    },
  },
  database: prismaAdapter(prismadb, {
    provider: "mongodb",
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [openAPI(), multiSession()],
});

export default auth;
