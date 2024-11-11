import { cleanString } from "../utils/strings";
import { ValidationError } from "../errors";
import { VaildStringData } from "./types";



export const notNull = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
}

export const validString = (value: any): value is string => {
  return notNull(value) && typeof value.toString() === "string";
}

export const validDate = (date?: any): boolean => {
  return notNull(date) && !!(date && !isNaN(new Date(date).getTime()));
}

export const validateStrField = ({
  fieldName,
  value,
  maxLength,
  regex
}: VaildStringData) => {
  if (notNull(value) && validString(value)) {
    const stringValue = value.toString();
    if (notNull(maxLength) && stringValue.length > maxLength) {
      throw new ValidationError("", {
        details: [`${fieldName} must not exceed ${maxLength} characters.`]
      });
    }
    if (value && (regex && !regex.test(stringValue))) {
      throw new ValidationError("", {
        details: [`Please enter a valid ${fieldName}.`]
      });
    }

    return true;
  } else {
    return false;
  }
}

export const validNumber = (value: any): value is number => {
  return notNull(value) && typeof value === "number" && !isNaN(value);
}

export const validBoolean = (value: any): value is boolean => {
  return notNull(value) && typeof value === "boolean";
}

export const validArray = <T>(value: any): value is T[] => {
  return notNull(value) && Array.isArray(value);
}

export const validObj = (value: any): value is object => {
  return notNull(value) && typeof value === "object" && !Array.isArray(value);
}

const invalidDataError = (field: string, model: string) => (
  new ValidationError("", {
    details: [`Please pass '${field}' for ${model}.`]
  })
);

type ValidateFieldArgs<T> = {
  field: T;
  validator: (value: any) => boolean;
  fieldName: string;
  modelName: string;
}
export const validateField = <T>({
  field,
  validator,
  fieldName,
  modelName
}: ValidateFieldArgs<T>): T => {
  if (validator(field)) return field;
  throw invalidDataError(fieldName, modelName);
}

/**
 * Helper function to check if a value exists in a given enum.
 * @param value - The value to check.
 * @param enumType - The enum type to validate against.
 * @returns The valid enum value if it exists, or `undefined`.
 */
export function isEnumValue<T extends Record<string, string | number>>(
  value: any,
  enumType: T
): T[keyof T] | undefined {
  const validValues = Object.values(enumType);
  if (validValues.includes(cleanString(value))) {
    return value as T[keyof T];
  }
  return undefined;
}


/************************************/
/** Parses input data as valid JSON */
export const deepJSONParse = (obj: any): any => {
  if (typeof obj === "string") {
    try {
      return deepJSONParse(JSON.parse(obj));
    } catch (e) {
      return cleanString(obj);
    }
  }
  if (Array.isArray(obj)) {
    return obj.map(deepJSONParse);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc: any, key) => {
      acc[key] = deepJSONParse(obj[key]);
      return acc;
    }, {});
  }

  return obj;
}