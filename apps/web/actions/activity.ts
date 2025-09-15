import type { ContextType } from "@/lib/types/prisma";
import { GenerateUUID } from "@/lib/uuid";

interface LogActivityProps {
  ctx: ContextType
  sessionId?: string;
  description: string;
  actionType: string;
  category?: string;
  onlyAdmin: boolean
  data?: any;
}

export async function LogActivity({ ctx, sessionId, description, actionType, data, category, onlyAdmin = true}: LogActivityProps) {
  const ipAddress = ctx.headers?.get("x-forwarded-for") ?? "";
  const userAgent = ctx.headers?.get("user-agent") ?? "";
  const objectGuid = GenerateUUID();

  try {
    let sessionConnectData = undefined;

    if (sessionId) {
      const session = await ctx.db.session.findUnique({ where: { id: sessionId } });
      if (session) {
        sessionConnectData = { connect: { id: session.id } };
      }
    }

    return await ctx.db.activity.create({
      data: {
        objectGuid,
        session: sessionConnectData,
        description,
        actionType,
        category,
        data: data ?? null,
        context: sessionConnectData
          ? null
          : { ipAddress, userAgent },
        onlyAdmin,
      },
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    return null;
  }
}