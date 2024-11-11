import { Request, Response, NextFunction } from "express";
import { Prisma, User, Session } from "@prisma/client";



export type UserType =
  | "superAdmin"
  | "admin"
  | "vendor"
  | "customer";


export type SessionInfo = {
  deviceInfo: string;
  browserInfo: string;
  ipAddress: string;
}

export type AuthHandlerData = {
  session: Session;
  user: User;
}

export type NonAuthViewArgs = {
  path: string;
  prismaTxn?: Prisma.TransactionClient;
  sessionInfo?: SessionInfo;
}

export type NonAuthViewHandlerArgs = {
  req: Request;
  res: Response;
  next: NextFunction;
  isTxn?: boolean;
  view: (args: NonAuthViewArgs) => Promise<any>;
}

export type AuthViewArgs = NonAuthViewArgs & {
  auth: AuthHandlerData;
}

export type AuthViewHandlerArgs = Omit<NonAuthViewHandlerArgs, "view"> & {
  userType: UserType;
  view: (args: AuthViewArgs) => Promise<any>;
}

export type QueryParams = {
  [key: string]: string;
}