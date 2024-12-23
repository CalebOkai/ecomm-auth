import { ErrorJson } from "./types";



export class ApplicationError extends Error {
  json: ErrorJson;
  status = 400;
  name = "ApplicationError";

  constructor(message: string, json: ErrorJson) {
    super(message);
    this.json = json;
  }
}

export class ValidationError extends ApplicationError {
  name = "ValidationError";
  status = 400;
}

export class NotFoundError extends ApplicationError {
  name = "NotFoundError";
  status = 404;
}

export class PermissionDeniedError extends ApplicationError {
  name = "PermissionDeniedError";
  status = 403;
}

export class UnauthorizedError extends ApplicationError {
  name = "UnauthorizedError";
  status = 401;
}


export class DbError extends ApplicationError {
  name = "DbError";
  status = 500;
}

export const isApplicationError = (err: any) => {
  const doesNameMatch = [
    "ApplicationError",
    "ValidationError",
    "NotFoundError",
    "PermissionDeniedError",
    "UnauthorizedError",
    "DbError",
  ].includes(err.name);

  return doesNameMatch;
}