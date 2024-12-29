import { Prisma, User, Session, Device } from "@prisma/client";
import { Request, Response, NextFunction } from "express";



export type UserType =
  | "superAdmin"
  | "admin"
  | "user";


export type AuthHandlerData = {
  session: Session;
  user: User;
}

export type BasicViewArgs = {
  prismaTxn?: Prisma.TransactionClient;
  device: Device;
  path: string;
}

export type NonAuthViewArgs = {
  req: Request;
  res: Response;
  next: NextFunction;
  isTxn?: boolean;
  view: (args: BasicViewArgs) => Promise<any>;
}

type BasicAuthViewArgs = BasicViewArgs & {
  auth: AuthHandlerData;
}

export type AuthViewArgs = Omit<NonAuthViewArgs, "view"> & {
  userType: UserType;
  view: (args: BasicAuthViewArgs) => Promise<any>;
}