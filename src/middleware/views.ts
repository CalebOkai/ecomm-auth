import { Prisma } from "@prisma/client";

import { NonAuthViewArgs, AuthViewArgs, AuthHandlerData } from "./types";
import { isApplicationError, PermissionDeniedError } from "../errors";
import { default403, default500 } from "../errors/defaultMsgs";
import { getOrCreateDevice } from "../models/devices";
import { prismaClient } from "../models";
import { isUser } from "./auth";
import logger from "./logger";



/*****************************************************
 * **Get User and Session from Request via the Token**
 * @param args Authenticated view args
 */
const getAuthData = async (
  args: AuthViewArgs
): Promise<AuthHandlerData | null> => {
  const { req, userType } = args;
  switch (userType) {
    case "superAdmin":
      const auth = await isUser(req);
      return auth;
    default:
      return null;
  }
}


/********************************
 * **Authenticated View Handler**
 * @param args Authenticated view args
 */
export const AuthView = async (
  args: AuthViewArgs
) => {
  const { req, res, isTxn = true, view } = args;
  const path = req.path;
  try {
    const auth = await getAuthData(args);
    const device = await getOrCreateDevice(req);
    if (!auth) {
      throw new PermissionDeniedError("", default403);
    }
    if (isTxn) {
      return await prismaClient.$transaction(async (
        prismaTxn: Prisma.TransactionClient
      ) => {
        return await view({ path, auth, device, prismaTxn });
      }, {
        maxWait: 60000,
        timeout: 60000
      });
    } else {
      return await view({ path, auth, device });
    }
  } catch (err: any) {
    logger.error(err);
    if (isApplicationError(err)) {
      return res.status(err.status).json(err.json);
    } else {
      return res.status(500).json(default500);
    }
  }
}


/********************************
 * **Non-Authenticated View Handler**
 * @param args NOn-authenticated view args
 */
export const NonAuthView = async (
  args: NonAuthViewArgs
) => {
  const { req, res, isTxn = true, view } = args;
  const path = req.path;
  try {
    const device = await getOrCreateDevice(req);
    if (isTxn) {
      return await prismaClient.$transaction(async (
        prismaTxn: Prisma.TransactionClient
      ) => {
        return await view({ path, device, prismaTxn });
      }, {
        maxWait: 60000,
        timeout: 60000
      });
    } else {
      return await view({ path, device });
    }
  } catch (err: any) {
    logger.error(err);
    if (isApplicationError(err)) {
      return res.status(err.status).json(err.json);
    } else {
      return res.status(500).json(default500);
    }
  }
}