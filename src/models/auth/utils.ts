import { User } from "@prisma/client";

import { checkFailedLoginAttempts } from "../loginAttempts";
import { validatePassword } from "../passwords/validation";
import { sendVerificationCode } from "../verification";
import { getUserByEmail } from "../users/read";
import { CreateNonAuthModel } from "../types";
import { verifiedDevice } from "../devices";
import { createSession } from "../sessions";
import { prismaClient } from "..";
import {
  NotFoundError,
  PermissionDeniedError,
  UnauthorizedError,
  ValidationError
} from "../../errors";
import {
  EmailSignInData,
  isEmailSignInData,
  PhoneSignInData,
  SignInResponse
} from "./types";



/******************************************
 * **Handle a potentially archived `User`**
 * @param user The currently logged-in user
 * @throws `UnauthorizedError` if the user account has been archived.
 * @returns The `User` instance if the account is not suspended.
 */
export const handleArchivedUser = async (
  user: User
): Promise<User> => {
  // Handle Archived User
  if (user.archivedAt) {
    const errorMsg = (
      `Your account has been suspended.${"\n"
      }If you would like to restore your account,${" "
      }please contact Support.`
    );
    throw new UnauthorizedError("", {
      details: [errorMsg]
    });
  }

  return user;
}


/*******************
 * **Email Sign in**
 * @param args Create model (non-authenticated)
 */
export const emailSignIn = async (
  args: CreateNonAuthModel<EmailSignInData>
): Promise<User> => {
  const { fields } = args;
  const { email, password } = fields;
  try {
    const user = await getUserByEmail({ ...args, email });
    await checkFailedLoginAttempts({
      ...args,
      fields: user
    });
    const validPassword = await validatePassword({
      ...args,
      fields: {
        userId: user.id,
        password
      }
    });
    if (!validPassword) {
      throw new PermissionDeniedError("", {
        details: [
          `Incorrect password.${"\n"
          }Please check and try again.`
        ]
      });
    }

    return user;
  } catch {
    throw new NotFoundError("", {
      details: [
        `There's no account associated with that email.${"\n"
        }Please check and try again.`
      ]
    });
  }
}


/*******************
 * **Phone Sign in**
 * @param args Create model (non-authenticated)
 */
export const phoneSignIn = async (
  args: CreateNonAuthModel<PhoneSignInData>
): Promise<User> => {
  const { prismaTxn, fields } = args;
  const prisma = prismaTxn || prismaClient;
  const { countryCode, phoneNumber } = fields;
  let user = await prisma.user.findFirst({
    where: {
      countryCode,
      phoneNumber
    }
  });
  if (!user) {
    throw new ValidationError("", {
      details: [
        `There's no account associated with that phone number.${"\n"
        }Please check and try again.`
      ]
    });
  }

  return user;
}


/***********************************
 * **Handle Email or Phone Sign In**
 * @param args `GetModel`
 * @returns `Promise<User & { token: string }>` or `Promise<boolean>`*/
export const handleSignInOptions = async (
  args: CreateNonAuthModel<EmailSignInData | PhoneSignInData>
): Promise<SignInResponse> => {
  const { fields: validatedData, device } = args;
  let user: User | undefined = undefined;
  // Email Sign in
  if (isEmailSignInData(validatedData)) user = await emailSignIn({
    ...args,
    fields: validatedData
  });
  // Phone Sign in
  else user = await phoneSignIn({
    ...args,
    fields: validatedData
  });
  await handleArchivedUser(user);
  if (
    await verifiedDevice({ ...args, id: device.id }) &&
    isEmailSignInData(validatedData)
  ) {
    // Email Sign-in: Return user and token for a previously verified device
    const session = await createSession({
      ...args,
      fields: {
        userId: user.id
      }
    });

    return {
      user,
      token: session.token
    }
  } else {
    // Email Sign-in: Verify device before proceeding
    // Phone Sign-in: Verify phone number before proceeding
    const verification = await sendVerificationCode({
      ...args,
      fields: {
        type: "otp",
        user: {
          connect: {
            id: user.id
          }
        }
      }
    });

    return {
      user,
      verification
    }
  }
}