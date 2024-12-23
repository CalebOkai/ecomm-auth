import { decryptPassword, encryptPassword } from "../../utils/crypto";
import { checkPasswordStrength } from "./validation";
import { ValidationError } from "../../errors";
import { CreatePasswordFields } from "./types";
import { CreateNonAuthModel } from "../types";
import { getUserById } from "../users";
import { prismaClient } from "..";



/********************/
/** Create Password */
const createPassword = async (
  args: CreateNonAuthModel<CreatePasswordFields>
) => {
  const { prismaTxn, fields } = args;
  const { userId, newPassword } = fields;
  const prisma = prismaTxn || prismaClient;
  const user = await getUserById({ ...args, id: userId });
  checkPasswordStrength(newPassword, user.email);
  const { salt, hash } = await encryptPassword(newPassword);
  await prisma.password.create({
    data: {
      salt,
      hash,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
}


/*************************************************/
/** Check if a password has previously been used */
const checkPreviousPasswords = async (
  args: CreateNonAuthModel<CreatePasswordFields>
) => {
  const { prismaTxn, fields } = args;
  const { userId, newPassword } = fields;
  const prisma = prismaTxn || prismaClient;
  const passwords = await prisma.password.findMany({
    where: { userId }
  });
  for (const password of passwords) {
    const { salt, hash } = password;
    const passwordUsed = await decryptPassword(newPassword, salt, hash);
    if (passwordUsed) {
      throw new ValidationError("", {
        details: [
          `It seems you've used this password before,${" "
          }please choose a different one.`
        ]
      });
    }
  }
}


/********************/
/** Update Password */
export const updatePassword = async (
  args: CreateNonAuthModel<CreatePasswordFields>
) => {
  // Ensure password has not been used before
  await checkPreviousPasswords(args);
  // Create a new password
  await createPassword(args);

  return true;
}