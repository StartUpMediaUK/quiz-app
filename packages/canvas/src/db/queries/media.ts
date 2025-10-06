"use server";
import { GenerateUUID } from "@/lib/uuid";
import { Prisma } from "@prisma/client";
import { CanvasDBQuery } from "../canvas-db";

interface getMediaProps extends CanvasDBQuery {
  accountId: string;
}
export const getMedia = async ({accountId,db}: getMediaProps) => {
  const mediaFiles = await db.media.findMany({
    where: {
      accountId: accountId,
    },
  });

  return mediaFiles;
};

interface createMediaProps extends CanvasDBQuery {
  accountId: string;
  mediaFiles: Prisma.MediaCreateInput
}
export const createMedia = async ({db, accountId, mediaFiles}: createMediaProps) => {
  const { link, name } = mediaFiles;

  const response = await db.media.create({
    data: {
      objectGuid: GenerateUUID(),
      accountId,
      link,
      name,
    },
  });

  return response;
};


interface deleteMediaProps extends CanvasDBQuery {
  mediaId: string;
}
export const deleteMedia = async ({mediaId, db}: deleteMediaProps) => {
  const response = await db.media.delete({
    where: {
      id: mediaId,
    },
  });

  return response;
};
