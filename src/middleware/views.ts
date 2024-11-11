import { Prisma } from "@prisma/client";

import { default403, default500 } from "../errors/defaultMsgs";
import { cleanString } from "../utils/strings";
import { prismaClient } from "../models";
import logger from "./logger";
import {
  isUser,
  setSessionInfo,
  getAuthToken
} from "./auth";
import {
  isApplicationError,
  PermissionDeniedError,
} from "../errors";
import {
  NonAuthViewHandlerArgs,
  AuthViewHandlerArgs,
  AuthHandlerData,
  QueryParams
} from "./types";



/**************************************************/
/** Get User, Token and Subscription from Request */
const getAuthHandlerData = async ({
  req,
  userType = "superAdmin",
}: AuthViewHandlerArgs): Promise<AuthHandlerData | null> => {
  switch (userType) {
    case "superAdmin":
      const auth = await isUser(req);
      return auth;
    default:
      return null;
  }
}


/*******************************/
/** Authenticated View Handler */
export const AuthViewHandler = async (
  args: AuthViewHandlerArgs
) => {
  const { req, res, isTxn = true, view } = args;
  const path = req.path;
  try {
    const auth = await getAuthHandlerData(args);
    if (!auth) {
      throw new PermissionDeniedError("", default403);
    }
    if (isTxn) {
      return await prismaClient.$transaction(async (
        prismaTxn: Prisma.TransactionClient
      ) => {
        return await view({ path, auth, prismaTxn });
      }, {
        maxWait: 60000,
        timeout: 60000
      });
    } else {
      return await view({ path, auth });
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


/***********************************/
/** Non-Authenticated View Handler */
export const NonAuthViewHandler = async (
  args: NonAuthViewHandlerArgs
) => {
  const { req, res, isTxn = true, view } = args;
  const path = req.path;
  try {
    await setSessionInfo(req);
    getAuthToken(req);
  } catch { }
  try {
    if (isTxn) {
      return await prismaClient.$transaction(async (
        prismaTxn: Prisma.TransactionClient
      ) => {
        return await view({ path, prismaTxn });
      }, {
        maxWait: 60000,
        timeout: 60000
      });
    } else {
      return await view({ path });
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


/*********************/
/** Get Query Params */
export const getQueryParams = (
  query: { [key: string]: any },
  keys: string[]
): QueryParams => {
  const extracted: QueryParams = {};
  keys.forEach((key) => {
    const rawValue = query[key] !== undefined ? String(query[key]).trim() : "";
    let decodedValue = "";
    try {
      decodedValue = decodeURIComponent(rawValue);
    } catch (e: any) {
      decodedValue = rawValue;
    }
    extracted[key] = decodedValue;
  });

  return extracted;
}


/*******************************/
/** Clean search string filter */
export const searchFilter = (
  term: string
): string | Prisma.StringFilter | undefined => ({
  contains: cleanString(term),
  mode: "insensitive"
});