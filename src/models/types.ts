import { Prisma, PrismaClient } from "@prisma/client";

import { AuthHandlerData, BasicViewArgs } from "../middleware/types";



export type PrismaTxnOrClient =
  | Prisma.TransactionClient
  | PrismaClient;


// Base args required for Non-authenticated model operations
export type BaseNonAuthModelArgs<
  IncludeType = undefined
> = BasicViewArgs & {
  include?: IncludeType;
}
// Base args required for Authenticated model operations
export type BaseModelArgs<
  IncludeType = undefined
> = BaseNonAuthModelArgs<
  IncludeType
> & {
  auth: AuthHandlerData;
}


// Create Model (Non-authenticated)
export type CreateNonAuthModel<
  FieldsType,
  IncludeType = undefined
> = BaseNonAuthModelArgs<
  IncludeType
> & {
  fields: FieldsType;
}
// Create Model (Authenticated)
export type CreateModel<
  FieldsType,
  IncludeType = undefined
> = BaseModelArgs<
  IncludeType
> & CreateNonAuthModel<
  FieldsType
>;


// List Model (Non-authenticated)
export type ListNonAuthModel<
  FilterType,
  IncludeType = undefined
> = BaseNonAuthModelArgs<
  IncludeType
> & {
  filters: FilterType;
  page?: number;
  pageSize?: number;
  orderBy?: any;
}
// List Model (Authenticated)
export type ListModel<
  FilterType,
  IncludeType = undefined
> = BaseModelArgs<
  IncludeType
> & ListNonAuthModel<
  FilterType,
  IncludeType
>;


// Get Model (Non-authenticated)
export type GetNonAuthModel<
  IdType,
  IncludeType = undefined
> = BaseNonAuthModelArgs<
  IncludeType
> & {
  id: IdType;
}
// Get Model (Authenticated)
export type GetModel<
  IdType,
  IncludeType = undefined
> = BaseModelArgs<
  IncludeType
> & BaseModelArgs<
  IncludeType
> & GetNonAuthModel<
  IdType,
  IncludeType
>;


// Update Model (Non-authenticated)
export type UpdateNonAuthModel<
  IdType,
  FieldsType,
  IncludeType = undefined
> = CreateNonAuthModel<
  FieldsType,
  IncludeType
> & {
  id: IdType;
}
// Update Model (Authenticated)
export type UpdateModel<
  IdType,
  FieldsType,
  IncludeType = undefined
> = BaseModelArgs<
  IncludeType
> & UpdateNonAuthModel<
  IdType,
  FieldsType,
  IncludeType
>;


// Delete Model (Non-authenticated)
export type DeleteNonAuthModel<
  IdType,
  IncludeType = undefined
> = BaseNonAuthModelArgs<
  IncludeType
> & {
  id: IdType;
}
// Delete Model (Authenticated)
export type DeleteModel<
  IdType,
  IncludeType = undefined
> = BaseModelArgs<
  IncludeType
> & BaseModelArgs<
  IncludeType
> & DeleteNonAuthModel<
  IdType,
  IncludeType
>;


// Create or Update Model (Non-authenticated)
export type CreateOrUpdateNonAuthModel<
  FieldsType,
  IdType = unknown,
  IncludeType = undefined
> = CreateNonAuthModel<
  FieldsType,
  IncludeType
> & {
  id?: IdType;
}
// Create or Update Model (Authenticated)
export type CreateOrUpdateModel<
  FieldsType,
  IdType = unknown,
  IncludeType = undefined
> = BaseModelArgs<
  IncludeType
> & CreateOrUpdateNonAuthModel<
  FieldsType,
  IdType,
  IncludeType
>;


// Validate Create Model (Non-authenticated)
export type ValidateCreateNonAuthModel<
  FieldsType,
  IncludeType = undefined
> = CreateNonAuthModel<
  FieldsType,
  IncludeType
> & {
  prisma: PrismaTxnOrClient;
}
// Validate Create Mode (Authenticated)
export type ValidateCreateModel<
  FieldsType,
  IncludeType = undefined
> = BaseModelArgs<
  IncludeType
> & ValidateCreateNonAuthModel<
  FieldsType,
  IncludeType
>;


// Validate Update Model (Non-authenticated)
export type ValidateUpdateNonAuthModel<
  IdType,
  FieldsType,
  IncludeType = undefined
> = UpdateNonAuthModel<
  IdType,
  FieldsType,
  IncludeType
> & {
  prisma: PrismaTxnOrClient;
}
// Validate Update Model (Authenticated)
export type ValidateUpdateModel<
  IdType,
  FieldsType,
  IncludeType = undefined
> = ValidateUpdateNonAuthModel<
  IdType,
  FieldsType,
  IncludeType
>;


// Validate Create or Update Model (Non-authenticated)
export type ValidateCreateOrUpdateNonAuthModel<
  FieldsType,
  IdType = unknown,
  IncludeType = undefined
> = CreateOrUpdateNonAuthModel<
  FieldsType,
  IdType,
  IncludeType
> & {
  action: "create" | "update";
  prisma: PrismaTxnOrClient;
}
// Validate Create or Update Model (Authenticated)
export type ValidateCreateOrUpdateModel<
  FieldsType,
  IdType = unknown,
  IncludeType = undefined
> = BaseModelArgs<
  IncludeType
> & ValidateCreateOrUpdateNonAuthModel<
  FieldsType,
  IdType,
  IncludeType
>;