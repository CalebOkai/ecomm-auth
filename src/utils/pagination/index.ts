import { ListNonAuthModel } from "../../models/types";
import {
  ListPaginatedInstancesArgs,
  PaginatedResponse,
  PaginatedResponseArgs
} from "./types";



/********************************************/
/** Convert `orderBy` Object back to String */
export const orderByToString = (orderBy: any): string | undefined => {
  if (!orderBy || typeof orderBy !== "object") {
    return undefined;
  }
  // Recursively build the order string
  const buildOrderByString = (obj: any, parentKey: string = ""): string => {
    const key = Object.keys(obj)[0];
    const value = obj[key];
    if (typeof value === "object") {
      return buildOrderByString(
        value, parentKey ? `${parentKey}.${key}` : key
      );
    }

    return `${parentKey ? `${parentKey}.${key}` : key},${value}`;
  }

  return buildOrderByString(orderBy);
}


export const paginationOptions = <
  FilterType,
  IncludeType
>(
  args: ListNonAuthModel<FilterType, IncludeType>
) => {
  const { page, pageSize } = args;
  if (!(page && pageSize)) return {};
  const skip = (page - 1) * pageSize;
  const pagination = {
    take: pageSize,
    skip
  }

  return pagination;
}


const paginatedResponse = <
  ModelType,
  FilterType,
  IncludeType
>(
  args: PaginatedResponseArgs<ModelType, FilterType, IncludeType>
): PaginatedResponse<ModelType> => {
  const { args: modelArgs, count, results } = args;
  const { page, pageSize, orderBy, path: rawPath } = modelArgs;
  // Remove trailing slash if it exists
  const path = rawPath.replace(/\/$/, "");
  if (!(page && pageSize)) return {
    count,
    results
  }
  // Calculate total pages and next/previous page links
  const totalPages = Math.ceil(count / pageSize);
  const nextPage = page < totalPages
    ? `${path}/?page=${page + 1}&pageSize=${pageSize}`
    : null;
  const previousPage = page > 1
    ? `${path}/?page=${page - 1}&pageSize=${pageSize}`
    : null;
  const orderByString = orderByToString(orderBy);
  const response = {
    count,
    orderBy: orderByString,
    pages: totalPages,
    pageSize,
    previousPage,
    nextPage,
    results
  }

  return response;
}


export const listPaginatedInstances = async <
  ModelType,
  FilterType,
  IncludeType,
>(
  args: ListPaginatedInstancesArgs<FilterType, IncludeType>
): Promise<PaginatedResponse<ModelType>> => {
  const { args: modelArgs, prisma, model } = args;
  const { filters, include, orderBy } = modelArgs;
  const findManyParams: any = {
    ...paginationOptions<FilterType, IncludeType>(modelArgs),
    where: filters,
  };
  if (include) findManyParams["include"] = include;
  if (orderBy) findManyParams["orderBy"] = orderBy;
  const count = await prisma[model].count({ where: filters });
  const results = await prisma[model].findMany(findManyParams);

  return paginatedResponse({
    args: modelArgs,
    count,
    results
  });
}