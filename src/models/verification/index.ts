import { Prisma } from "@prisma/client";
import { subHours } from "date-fns";
import { v4 } from "uuid";

import { randomDigits } from "../../utils/crypto";
import { CreateNonAuthModel } from "../types";
import { prismaClient } from "..";



/*****************************************
 * **Generate and Send Verification Code**
 * @param args `CreateNonAuthModel`
 * @returns `Promise<boolean>`*/
export const sendVerificationCode = async (
  args: CreateNonAuthModel<Omit<Prisma.VerificationCreateInput, "code">>
): Promise<boolean> => {
  const { prismaTxn, fields } = args;
  const prisma = prismaTxn || prismaClient;
  let code = "";
  if (fields.type === "otp")
    code = `${randomDigits(5)}`;
  else
    code = v4();
  const verification = await prisma.verification.create({
    data: {
      ...fields,
      code
    }
  });
  if (verification.type === "otp") {
    // Send SMS
  } else {
    // Send Email
  }

  return true;
}


/*****************************************************************
 * **Check if a user's verification was performed in recent past**
 * (defaults to 24 hours)**
 * @param args Create model (non-authenticated)
 */
export const recentlyVerified = async (
  args: CreateNonAuthModel<{
    email: string;
    hours?: number;
  }>
): Promise<boolean> => {
  const { prismaTxn, fields, device } = args;
  const prisma = prismaTxn || prismaClient;
  const { email, hours = 24 } = fields;
  const targetDiff = subHours(new Date, hours);
  const verification = await prisma.verification.findFirst({
    where: {
      user: {
        email
      },
      verifiedById: {
        not: null
      },
      updatedAt: {
        gte: targetDiff
      }
    }
  });

  if (verification) return true;
  else return false;
}