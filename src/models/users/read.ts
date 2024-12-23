import { Prisma, User } from "@prisma/client";

import { PaginatedResponse } from "../../utils/pagination/types";
import { listPaginatedInstances } from "../../utils/pagination";
import { GetNonAuthModel, ListModel } from "../types";
import { cleanEmail } from "../../utils/strings";
import { NotFoundError } from "../../errors";
import { prismaClient } from "..";



/****************
 * **List Users**
 * @param args List model (authenticated)
 */
export const listUsers = async (
  args: ListModel<
    Prisma.UserWhereInput,
    Prisma.UserInclude
  >
): Promise<PaginatedResponse<User>> => {
  const { prismaTxn, orderBy } = args;
  const prisma = prismaTxn || prismaClient;
  const response = await listPaginatedInstances<
    User,
    Prisma.UserWhereInput,
    Prisma.UserInclude
  >({
    model: "user",
    prisma,
    args: {
      ...args,
      orderBy: orderBy || { createdAt: "desc" }
    }
  });

  return response;
}


/*********************
 * **Gets User by ID**
 * @param args Get model (non-authenticated)
 */
export const getUserById = async <
  IncludeType extends Prisma.UserInclude | undefined = undefined
>(
  args: GetNonAuthModel<string, IncludeType>
): Promise<
  Prisma.UserGetPayload<IncludeType extends Prisma.UserInclude
    ? { include: IncludeType }
    : {}
  >
> => {
  const { prismaTxn, id, include } = args;
  const prisma = prismaTxn || prismaClient;
  const user = await prisma.user.findUnique({
    where: { id },
    ...(include ? { include } : {}),
  });
  if (!user) {
    throw new NotFoundError("", {
      details: ["User not found"],
    });
  }

  return user as Prisma.UserGetPayload<
    IncludeType extends Prisma.UserInclude
    ? { include: IncludeType }
    : {}
  >;
}


/************************
 * **Gets User by Email**
* @param args Get model (non-authenticated)
 */
export const getUserByEmail = async <
  IncludeType extends Prisma.UserInclude | undefined = undefined
>(
  args: Omit<
    GetNonAuthModel<string, IncludeType> & {
      email: string
    }, "id"
  >
): Promise<
  Prisma.UserGetPayload<IncludeType extends Prisma.UserInclude
    ? { include: IncludeType }
    : {}
  >
> => {
  const { prismaTxn, email, include } = args;
  const prisma = prismaTxn || prismaClient;
  const user = await prisma.user.findUnique({
    where: { email: cleanEmail(email) },
    include
  });
  if (!user || (user && user.archivedAt)) {
    throw new NotFoundError("", {
      details: ["User not found"]
    });
  }

  return user as Prisma.UserGetPayload<
    IncludeType extends Prisma.UserInclude
    ? { include: IncludeType }
    : {}
  >;
}