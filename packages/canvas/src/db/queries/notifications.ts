import { GenerateUUID } from "@/lib/uuid";
import { CanvasDBQuery } from "../canvas-db";

interface saveActivityLogsNotificationProps extends CanvasDBQuery {
  description: string;
}

export const saveActivityLogsNotification = async ({ db, description }: saveActivityLogsNotificationProps) => {
  await db.notification.create({
    data: {
      objectGuid: GenerateUUID(),
      notification: `${description}`,
    },
  });
  return;
};