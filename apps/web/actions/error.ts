import type { ContextType } from "@/lib/types/prisma";
import { GenerateUUID } from "@/lib/uuid";

interface LogErrorProps {
  ctx: ContextType
  sessionId?: string;
  error: string;
  resource: string;
  status: string;
  data: any,
}

export async function LogError({ ctx, sessionId,data, resource, error, status}: LogErrorProps) {
  try {
    const host = ctx.headers.get("host") ?? "";

    const ipAddress = ctx.headers.get("x-forwarded-for") ?? "";
    const userAgent = ctx.headers.get("user-agent ") ?? "";

    const session = await ctx.db.session.findUnique({ where: { id: sessionId } });
    const objectGuid = GenerateUUID();

    return ctx.db.errorLog.create({
      data: {
        objectGuid,
        session: { connect: { id: sessionId } },
        error,
        resource,
        status,
        data: data ?? null,
        context: !session ? { ipAddress, userAgent } : null,
        endpoint: host,
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}