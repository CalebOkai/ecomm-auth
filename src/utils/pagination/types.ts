import { PrismaClient } from "@prisma/client";

import { ListNonAuthModel } from "../../models/types";



export type ListPaginatedInstancesArgs<
  FilterType,
  IncludeType = undefined
> = {
  args: ListNonAuthModel<FilterType, IncludeType>;
  model: keyof PrismaClient;
  prisma: any;
}

export type PaginatedResponseArgs<
  ModelType,
  FilterType,
  IncludeType = undefined
> = {
  args: ListNonAuthModel<FilterType, IncludeType>;
  count: number;
  results: ModelType[];
}

export type PaginatedResponse<ModelType> = {
  count: number;
  results: ModelType[]
} | {
  count: number;
  orderBy: string | undefined;
  pages: number;
  pageSize: number;
  previousPage: string | null;
  nextPage: string | null;
  results: ModelType[];
}