import { Request } from "express";

import { notNull } from "../validators";



/********************************************/
/** Capitalize the first letter of a string */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/******************************************************************/
/** Parses as string and removes leading and trailing white space */
export const cleanString = (str: string | number): string => {
  if (notNull(str)) {
    const cleanedString = str.toString().trim();

    return cleanedString;
  }

  return "";
}

/************************/
/** Normalizes an email */
export const cleanEmail = (email: string): string => {
  return cleanString(email).toLocaleLowerCase()
}

/*************************************/
/** Convert Camel case to Kebab case */
export const camelToKebabCase = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/********************************/
/** Get the last segment of URL */
export const getLastUrlSegment = (req: Request) => {
  const segments = req.path.split('/').filter(segment => segment !== '');
  const lastSegment = segments[segments.length - 1];

  return lastSegment;
}

/***************************/
/** Normalize Country Code */
export const normalizeCountryCode = (input: string): string => {
  return cleanString(input).replace(/^\+/, '');
}

/*************/
/** Is Email */
export const isEmail = (input: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(input);
}


/***********************************************/
/** Camel Case to Readable, Capitalized string */
export function camelCaseToReadable(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')  // Add a space before each uppercase letter
    .replace(/^./, function (match) {
      return match.toUpperCase(); // Capitalize the first letter of the string
    });
}