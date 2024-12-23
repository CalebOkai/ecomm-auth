import { LoginAttempt, Prisma, User } from "@prisma/client";
import { subHours } from "date-fns";

import { PaginatedResponse } from "../../utils/pagination/types";
import { listPaginatedInstances } from "../../utils/pagination";
import { notNull, validBoolean } from "../../validators";
import { PermissionDeniedError } from "../../errors";
import { prismaClient } from ".."
import {
  BaseNonAuthModelArgs,
  CreateNonAuthModel,
  ListModel,
  UpdateNonAuthModel
} from "../types";



/**************************
 * **Create Login Attempt**
 * @param args Base model args (non-authenticated)
 */
export const createLoginAttempt = async (
  args: BaseNonAuthModelArgs
) => {
  // Should never be a transaction
  const prisma = prismaClient;
  const { device } = args;
  const loginAttempt = await prisma.loginAttempt.create({
    data: {
      device: {
        connect: {
          id: device.id
        }
      }
    }
  });

  return loginAttempt;
}


/**************************
 * **Update Login Attempt**
 * @param args Update model (non-authenticated)
 */
export const updateLoginAttempt = async (
  args: UpdateNonAuthModel<
    number,
    Omit<Prisma.LoginAttemptUpdateInput, "user"> & {
      user?: User
    }
  >
) => {
  // Should never be a transaction
  const prisma = prismaClient;
  const { id, fields } = args;
  const { successful, failureMetaData, successMetaData, user } = fields;
  const loginAttempt = await prisma.loginAttempt.update({
    where: { id },
    data: {
      ...validBoolean(successful) ? {
        successful
      } : {},
      ...(notNull(failureMetaData) ? {
        failureMetaData: JSON.parse(JSON.stringify(failureMetaData))
      } : {}),
      ...(notNull(successMetaData) ? {
        successMetaData: JSON.parse(JSON.stringify(successMetaData))
      } : {}),
      ...(notNull(user) ? {
        user: {
          connect: {
            id: user.id
          }
        }
      } : {})
    }
  });

  return loginAttempt;
}


/*************************
 * **List Login Attempts**
 * @param args List model instances (authenticated)
 */
export const listLoginAttempts = async (
  args: ListModel<
    Prisma.LoginAttemptWhereInput,
    Prisma.LoginAttemptInclude
  >
): Promise<PaginatedResponse<LoginAttempt>> => {
  const { prismaTxn, orderBy, include } = args;
  const prisma = prismaTxn || prismaClient;
  const response = await listPaginatedInstances<
    LoginAttempt,
    Prisma.LoginAttemptWhereInput,
    Prisma.LoginAttemptInclude
  >({
    model: "loginAttempt",
    prisma,
    args: {
      ...args,
      orderBy: orderBy || { attemptedAt: "desc" },
      include: {
        ...include,
        device: true
      }
    }
  });

  return response;
}


/********************************************************************
 * **Block user from logging in after 5 failed consecutive attempts**
 * @param args Create model (non-authenticated)
 * @throws `PermissionDeniedError` for multiple failed attempts
 */
export const checkFailedLoginAttempts = async (
  args: CreateNonAuthModel<User>
): Promise<void> => {
  // Should never be a transaction
  const prisma = prismaClient;
  const { fields: user } = args;
  const oneHourAgo = subHours(new Date(), 1);
  // Fetch the unsuccessful login attempts for the user in the past hour
  const unsuccessfulAttempts = await prisma.loginAttempt.findMany({
    where: {
      userId: user.id,
      successful: false,
      attemptedAt: { gte: oneHourAgo }
    },
    orderBy: { attemptedAt: "desc" }
  });
  // Check if there are at least 5 unsuccessful attempts in a row
  if (unsuccessfulAttempts.length >= 5) {
    // Ensure they are consecutive
    const areConsecutive = unsuccessfulAttempts.slice(0, 5).every(
      (attempt) => !attempt.successful
    );
    if (areConsecutive) {
      throw new PermissionDeniedError("", {
        details: [
          `We cannot log you in due to multiple unsuccessful${" "
          }login attempts.\nPlease contact Support.`
        ]
      });
    }
  }
}