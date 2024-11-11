import { PrismaClient } from "@prisma/client";

import { ListModel } from "../models/types";



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
      return buildOrderByString(value, parentKey ? `${parentKey}.${key}` : key);
    }

    return `${parentKey ? `${parentKey}.${key}` : key},${value}`;
  };

  return buildOrderByString(orderBy);
}


export const paginationOptions = (args: ListModel<any>) => {
  const { page, pageSize } = args;
  if (!(page && pageSize)) return {};
  const skip = (page - 1) * pageSize;
  const pagination = {
    take: pageSize,
    skip
  }

  return pagination;
}


type Pagination = {
  args: ListModel<any>;
  results: any[];
  count: number;
}
const paginatedResponse = ({
  args,
  results,
  count
}: Pagination) => {
  const { page, pageSize, orderBy, path: rawPath } = args;
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


type Args = {
  args: ListModel<any, any>;
  prisma: any;
  model: keyof PrismaClient;
}
export const listPaginatedInstances = async ({
  args,
  prisma,
  model
}: Args) => {
  const { filters, include, orderBy } = args;
  const findManyParams: any = {
    ...paginationOptions(args),
    where: filters,
  };
  if (include) findManyParams["include"] = include;
  if (orderBy) findManyParams["orderBy"] = orderBy;
  const count = await prisma[model].count({ where: filters });
  const results = await prisma[model].findMany(findManyParams);

  return paginatedResponse({
    args,
    count,
    results
  });
}