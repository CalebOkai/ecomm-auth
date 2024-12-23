import { Session, User } from "@prisma/client";
import { Request } from "express";

import { handleArchivedUser } from "../models/auth/utils";
import { refreshSession } from "../models/sessions";
import { default401 } from "../errors/defaultMsgs";
import { UnauthorizedError } from "../errors";
import { AuthHandlerData } from "./types";



/************************************
 * **Get Token from Request Headers**
 * @param req Express.js Request object
 */
export const getAuthToken = (
  req: Request
): string => {
  const authHeader = req.header("Authorization");
  let token = "";
  if (authHeader) {
    const [_, authToken] = authHeader.split(" ");
    token = authToken;
  }
  if (!token) {
    throw new UnauthorizedError("", default401);
  }

  return token;
}


/***********************************
 * **Get User's Session from Token**
 * @param req Express.js Request object
 */
export const getUsersSession = async (
  req: Request
): Promise<{ user: User; session: Session }> => {
  const token = getAuthToken(req);
  const { user, ...session } = await refreshSession(token);
  await handleArchivedUser(user);

  return {
    user,
    session
  }
}


/************************************
 * **Get the currently logged-in User**
 * @param req Express.js Request object
 */
export const isUser = async (
  req: Request
): Promise<AuthHandlerData> => {
  const { user, session } = await getUsersSession(req);

  return {
    user,
    session
  }
}