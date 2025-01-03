import { RequestHandler } from "express";



export type HTTPMethod =
  | "get"
  | "post"
  | "patch"
  | "delete";

export type Route<Method> = {
  path?: string;
  method: Method;
  middleware?: RequestHandler[];
  handler: RequestHandler;
}

export type PathObject<Method = unknown> = {
  [key: string]: Route<Method> | PathObject<Method>
}

export const isRoute = (obj: any): obj is Route<any> => {
  return (
    obj &&
    typeof obj === "object" &&
    "method" in obj &&
    "handler" in obj &&
    typeof obj.method === "string" &&
    typeof obj.handler === "function"
  );
}