import { Query } from "express-serve-static-core";
import { Prisma } from "@prisma/client";

import { cleanString } from "../utils/strings";
import { QueryParams } from "./types";



/*******************************/
/** Clean search string filter */
export const searchFilter = (
  term: string,
): string | Prisma.StringFilter | undefined => ({
  contains: cleanString(term),
  mode: "insensitive",
});


/*********************/
/** Get Query Params */
export const getQueryParams = (
  query: { [key: string]: any },
  keys: string[]
): QueryParams => {
  const extracted: QueryParams = {};
  keys.forEach((key) => {
    const rawValue = query[key] !== undefined ? String(query[key]).trim() : "";
    let decodedValue = "";
    try {
      decodedValue = decodeURIComponent(rawValue);
    } catch (e: any) {
      decodedValue = rawValue;
    }
    extracted[key] = decodedValue;
  });

  return extracted;
}


/***************************************/
/** Validate and Parse `orderBy` Param */
const validateOrderBy = (query: any): any => {
  const { orderBy: sort } = getQueryParams(query, ["orderBy"]);
  if (!sort) return undefined;
  const [fieldPath, order] = sort.split(",");
  if (!fieldPath || !["asc", "desc"].includes(order)) {
    // Invalid sort parameters
    return undefined;
  }

  // Split the field path
  // (e.g., "user.family.name" => ["user", "family", "name"])
  const fields = fieldPath.split(".");
  let orderBy: Record<string, any> = {};
  let currentLevel: Record<string, any> = orderBy;

  fields.forEach((field, index) => {
    if (index === fields.length - 1) {
      // Final field, set the order (asc/desc)
      currentLevel[field] = order;
    } else {
      // Intermediate level, create a nested object
      currentLevel[field] = {};
      currentLevel = currentLevel[field];
    }
  });

  return orderBy;
}


/******************************/
/** Extract Pagination Params */
const getPaginationParams = (
  query: Query
) => {
  const page = parseInt(query.page as string) || 1;
  const pageSize = parseInt(query.pageSize as string) || 50;

  return {
    page,
    pageSize
  }
}


/*****************************************/
/** Get Pagination, Filters, and sorting */
export const getQueryArgs = <T>(
  query: Query,
  validateFilters: (query: Query, ...extraArgs: any) => T,
  extraArgs?: any
) => {
  const pagination = getPaginationParams(query);
  const orderBy = validateOrderBy(query);
  const filters = validateFilters(
    query, ...[extraArgs]
  );

  return {
    ...pagination,
    filters,
    orderBy
  }
}