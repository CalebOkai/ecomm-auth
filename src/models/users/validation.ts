import { Prisma, User } from "@prisma/client";

import { capitalize, cleanEmail, cleanString } from "../../utils/strings";
import { ValidateCreateModel, ValidateUpdateModel } from "../types";
import { deepJSONParse, validateStrField } from "../../validators";
import { ValidationError } from "../../errors";
import { getUserById } from "./read";



/**********************************************************************
 * **Validate common fields for creating and updating a User instance**
 * @param args Unparsed JSON data
 */
const validateCommonFields = (
  parsedData: any
): Omit<Prisma.UserCreateInput, "id" | "email"> => {
  const { firstName } = parsedData;
  const validatedData: Omit<Prisma.UserCreateInput, "id" | "email"> = {
    // First Name
    ...(validateStrField({
      fieldName: "First Name",
      value: firstName,
      maxLength: 30,
      regex: /^[a-zA-Z-,./ ]+$/
    }) ? {
      firstName: capitalize(cleanString(firstName))
    } : {})
  }

  return validatedData;
}


/*****************************
 * **Validate Data on Update**
 * @param args Validate update model (authenticated)
 * @returns Validated data for updating a User instance
 */
export const validateDataOnUpdate = async (
  args: ValidateUpdateModel<string, any>
): Promise<Omit<Prisma.UserCreateInput, "id" | "email">> => {
  const { id, fields } = args;
  // Ensure User instance exists
  await getUserById({ ...args, id });
  const parsedData = deepJSONParse(JSON.stringify(fields));
  const validatedData = validateCommonFields(parsedData);

  return validatedData;
}


/*****************************
 * **Validate Data on Create**
 * @param args `ValidateCreateModel`
 */
export const validateDataOnCreate = async (
  args: ValidateCreateModel<any>
): Promise<Promise<Prisma.UserCreateInput>> => {
  const { fields, prisma } = args;
  const parsedData = deepJSONParse(JSON.stringify(fields));
  const { email } = parsedData;
  const cleanedEmail = cleanEmail(email);
  const existingUser = await prisma.user.findUnique({
    where: { email: cleanedEmail }
  })
  if (existingUser) throw new ValidationError("", {
    details: ["This email has already been taken. Please choose another."]
  });
  const commonData = validateCommonFields(parsedData);
  const validatedData: Prisma.UserCreateInput = {
    ...commonData,
    // Email
    email: cleanedEmail
  }

  return validatedData;
}


/*******************************************
 * **Check if the archive can be performed**
 * @param args Validate model on update (authenticated)
 */
export const validateArchive = async (
  args: ValidateUpdateModel<string, any>
): Promise<User> => {
  const { id } = args;
  const targetUser = getUserById({ ...args, id });

  return targetUser;
}