import { User } from "@prisma/client";

import { createLoginAttempt, updateLoginAttempt } from "../loginAttempts";
import { BaseModelArgs, CreateNonAuthModel } from "../types";
import { isEmailSignInData, SignInResponse } from "./types";
import { ApplicationError } from "../../errors";
import { handleSignInOptions } from "./utils";
import { validateSignIn } from "./validation";
import { deleteSession } from "../sessions";
import { prismaClient } from "..";



/********************
 * **Sign in a User**
 * @param args Create model (non-authenticated)
 */
export const signIn = async (
  args: CreateNonAuthModel<any>
): Promise<SignInResponse> => {
  const { prismaTxn } = args;
  const prisma = prismaTxn || prismaClient;
  const loginAttempt = await createLoginAttempt(args);
  const validatedData = await validateSignIn({ ...args, prisma });
  let successfulLogin: boolean = false;
  let loginfailureMetaData = undefined;
  let user: User | undefined = undefined;
  try {
    const response = await handleSignInOptions({
      ...args,
      fields: validatedData
    });
    successfulLogin = true;
    user = response.user;

    return response;
  } catch (error) {
    const { json: errorJson } = error as ApplicationError;
    successfulLogin = false;
    const attemptedCredentials = isEmailSignInData(validatedData)
      ? { email: validatedData.email } // dont log the password
      : validatedData
    loginfailureMetaData = {
      ...attemptedCredentials,
      error: errorJson
    }

    throw error as ApplicationError;
  } finally {
    await updateLoginAttempt({
      ...args,
      id: loginAttempt.id,
      fields: {
        failureMetaData: loginfailureMetaData,
        successful: successfulLogin,
        user
      }
    });
  }
}


/*********************
 * **Sign out a User**
 * @param args Base model args (authenticated)
 */
export const signOut = async (
  args: BaseModelArgs
) => {
  try {
    await deleteSession({
      ...args,
      id: args.auth.session.token,
    });
  } catch {
    // Ensure an error is never thrown if this fails
  }

  return true;
}