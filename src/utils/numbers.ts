import { ValidationError } from "../errors";



/*********************************************************/
/** Generates a random number between a in and max range */
export const randNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**************************************************/
/** Validates and returns an integer from a value */
export const getIdInt = (id: any, name?: string): number => {
  let idInt: number;
  const idError = new ValidationError("", {
    details: [`Invalid ${name ? name : ''} ID`]
  });
  try {
    idInt = parseInt(id.toString(), 10);
    if (isNaN(idInt)) throw idError;
  } catch {
    throw idError;
  }

  return idInt;
}


/*******************************************************/
/** Returns a price as a minor currency unit (Integer) */
export const minorPrice = (price: any): number => {
  const decimal = parseFloat(price.toString()).toFixed(2);
  const intStr = decimal.replace(".", "");
  const intValue = parseInt(intStr, 10);

  return intValue;
}


/*********************************/
/** Returns a price as a decimal */
export const decimalPrice = (input: any): string => {
  // Convert input to string and ensure it's at least 3 characters long by padding with zeros if necessary
  let intStr = typeof input === "number" ? input.toString() : input;
  intStr = intStr.padStart(3, "0");
  // Format the string to include a decimal point before the last two digits
  const decimalValue = `${intStr.slice(0, -2)}.${intStr.slice(-2)}`;

  return decimalValue;
}