import { CanvasPage } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { CanvasDBQuery } from "../canvas-db";

interface upsertCanvasPageProps extends CanvasDBQuery {
  subAccountId: string;
  canvasPageId: string;
  canvasPage: CanvasPage;
}

export const upsertCanvasPage = async ({ db, subAccountId, canvasPageId, canvasPage }: upsertCanvasPageProps): Promise<CanvasPage | undefined> => {
  if (!subAccountId || !canvasPageId) return undefined;

  const response = await db.canvasPage.upsert({
    where: {
      id: canvasPage.id || "",
    },
    update: canvasPage,
    create: {
      ...canvasPage,
      id: canvasPageId,
      content: canvasPage.content
        ? canvasPage.content
        : JSON.stringify([
            {
              content: [],
              id: "__body",
              name: "Body",
              styles: { backgroundColor: "white" },
              type: "__body",
            },
          ]),
    },
  });

  // reset page cache
  revalidatePath(`/subaccount/${subAccountId}/funnels/${canvasPageId}`);

  return response;
};