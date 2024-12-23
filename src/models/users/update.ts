import { validateArchive, validateDataOnUpdate } from "./validation";
import { GetModel, UpdateModel } from "../types";
import { prismaClient } from "..";



/*****************
 * **Update User**
 * @param args `UpdateModel`
 * @returns `Promise<User>` */
export const updateUser = async (
  args: UpdateModel<string, any>
) => {
  const { prismaTxn, id } = args;
  const prisma = prismaTxn || prismaClient;
  const validatedData = await validateDataOnUpdate({
    ...args,
    prisma
  });
  const updatedUser = await prisma.user.update({
    where: { id },
    data: validatedData
  });

  return updatedUser;
}


/******************
 * **Archive User**
 * @param args `GetModel`
 * @returns `Promsie<User>` */
export const archiveUser = async (
  args: GetModel<string>
) => {
  const { prismaTxn, id, auth } = args;
  const prisma = prismaTxn || prismaClient;
  await validateArchive({ ...args, prisma, fields: {} });
  const archivedUser = await prisma.user.update({
    where: { id },
    data: {
      archivedAt: new Date(),
      archivedBy: {
        connect: {
          id: auth.user.id
        }
      }
    }
  });

  return archivedUser;
}


/********************
 * **Unarchive User**
 * @param args `GetModel`
 * @returns `Promise<User>` */
export const unArchiveUser = async (
  args: GetModel<string>
) => {
  const { prismaTxn, id } = args;
  const prisma = prismaTxn || prismaClient;
  await validateArchive({ ...args, prisma, fields: {} });
  const unArchivedUser = await prisma.user.update({
    where: { id },
    data: {
      archivedAt: null,
      archivedBy: {
        disconnect: true
      }
    }
  });

  return unArchivedUser;
}