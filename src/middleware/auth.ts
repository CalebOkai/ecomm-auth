import { Request } from "express";
import useragent from "useragent";

import { handleArchivedUser } from "../models/auth/utils";
import { AuthHandlerData, SessionInfo } from "./types";
import { refreshSession } from "../models/sessions";
import { default401 } from "../errors/defaultMsgs";
import { UnauthorizedError } from "../errors";



/****************************************/
/** Get Auth Token from Request Headers */
export const getAuthToken = (req: Request): string => {
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


/******************************************/
/** Get Session info from Request Headers */
export const setSessionInfo = async (
  req: any
): Promise<SessionInfo> => {
  const agent = useragent.parse(req.headers["user-agent"]);
  req.useragent = agent;
  const deviceInfo = (
    `${req.useragent.os.toString()
    },${req.useragent.device.toString()}`
  );
  const browserInfo = req.useragent.toAgent();
  const forwarded = req.headers["x-forwarded-for"];
  const ipAddress = forwarded
    ? forwarded.split(',')[0]
    : req.connection.remoteAddress;
  const sessionInfo = {
    deviceInfo,
    browserInfo,
    ipAddress
  }
  req.sessionInfo = sessionInfo;

  return sessionInfo;
}


/**********************************/
/** Get User's Session from Token */
export const getUsersSession = async (req: Request) => {
  const token = getAuthToken(req);
  const sessionInfo = await setSessionInfo(req);
  const { user, ...session } = await refreshSession(
    token,
    sessionInfo
  );
  await handleArchivedUser(user);

  return {
    user,
    session
  };
}


/*******************/
/** Get Basic User */
export const isUser = async (
  req: Request
): Promise<AuthHandlerData> => {
  const { user, session } = await getUsersSession(req);

  return {
    session,
    user
  }
}