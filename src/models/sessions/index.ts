import { Prisma, Session } from "@prisma/client";
import { addDays } from "date-fns";

import { NotFoundError, UnauthorizedError } from "../../errors";
import { CreateNonAuthModel, GetModel } from "../types";
import { default401 } from "../../errors/defaultMsgs";
import { randomHexString } from "../../utils/crypto";
import { prismaClient } from "..";



/****************************
 * **Create a new `Session`**
 * @param args `CreateNonAuthModel`
 */
export const createSession = async (
  args: CreateNonAuthModel<{
    userId: string
  }>
): Promise<Session> => {
  const { prismaTxn, fields, device } = args;
  const prisma = prismaTxn || prismaClient;
  const { userId } = fields;
  const token = await randomHexString(128);
  const expiresAt = addDays(new Date(), 7);
  const data: Prisma.SessionCreateInput = {
    token,
    expiresAt,
    user: {
      connect: {
        id: userId
      }
    },
    devices: {
      connect: {
        id: device.id
      }
    }
  }
  const session = await prisma.session.create({
    data
  });

  return session;
}


/************************************
/* **Update a `Session`'s expiry date**
 * @param token Session ID (token).
 * @throws `Unauthorized` if session is not found.
 */
export const refreshSession = async (
  token: string
) => {
  const prisma = prismaClient;
  const expiresAt = addDays(new Date(), 7);
  const data: Prisma.SessionUpdateInput = {
    expiresAt
  }
  const session = await prisma.session.findUnique({
    where: { token }
  });
  if (!session) {
    throw new UnauthorizedError("", default401);
  }
  const updatedSession = await prisma.session.update({
    where: { token },
    data,
    include: {
      user: true
    }
  });

  return updatedSession;
}


/*********************************************
 * **Delete an existing session by the Token**
 * @param args Get model (authenticated)
 * @throws `NotFoundError` if session is not found.
 */
export const deleteSession = async (
  args: GetModel<string>
): Promise<void> => {
  const { prismaTxn, id } = args;
  const prisma = prismaTxn || prismaClient;
  try {
    await prisma.session.delete({
      where: { token: id },
    });
  } catch {
    throw new NotFoundError("", {
      details: ["Session not found"],
    });
  }
}