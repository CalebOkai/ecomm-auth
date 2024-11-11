import { Prisma, PrismaClient } from "@prisma/client";

import { AuthHandlerData } from "../middleware/types";



export type ModelAction =
  | "create"
  | "list"
  | "get"
  | "update"
  | "delete";

export type PrismaTxnOrClient =
  | Prisma.TransactionClient
  | PrismaClient;

// Basic arguments required for all model operations
export type BaseModelArgs<
  IncludeType = unknown
> = {
  auth: AuthHandlerData;
  prismaTxn?: Prisma.TransactionClient;
  include?: IncludeType;
  path: string;
}

// Create Model
export type CreateModel<
  FieldsType,
  IncludeType = {}
> = BaseModelArgs<
  IncludeType
> & {
  fields: FieldsType;
}

// List Model
export type ListModel<
  FilterType,
  IncludeType = {}
> = BaseModelArgs<
  IncludeType
> & {
  filters: FilterType;
  page?: number;
  pageSize?: number;
  orderBy?: any;
}

// Get Model
export type GetModel<
  IdType,
  IncludeType = {}
> = BaseModelArgs<
  IncludeType
> & {
  id: IdType;
}

// Update Model
export type UpdateModel<
  IdType,
  FieldsType,
  IncludeType = {}
> = CreateModel<
  FieldsType,
  IncludeType
> & {
  id: IdType;
}

// Delete Model
export type DeleteModel<
  IdType,
  IncludeType = {}
> = BaseModelArgs<
  IncludeType
> & {
  id: IdType;
}

// Create or Update Model
export type CreateOrUpdateModel<
  FieldsType,
  IdType = unknown,
  IncludeType = {}
> = CreateModel<
  FieldsType,
  IncludeType
> & {
  id?: IdType;
}

// Validate Model
export type ValidateModel<
  FieldsType,
  IdType = unknown,
  IncludeType = {}
> = CreateOrUpdateModel<
  FieldsType,
  IdType,
  IncludeType
> & {
  action: ModelAction;
  prisma: PrismaTxnOrClient;
}