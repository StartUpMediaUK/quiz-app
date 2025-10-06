import { Contact, Prisma } from "@prisma/client";
import { CanvasDBQuery } from "../canvas-db";


interface upsertContactProps extends CanvasDBQuery {
  contact: Prisma.ContactUncheckedCreateInput;
}

export const upsertContact = async ({ db, contact }: upsertContactProps): Promise<Contact | undefined> => {
  const response = await db.contact.upsert({
    where: { id: contact.id },
    update: contact,
    create: contact,
  });

  return response;
};
