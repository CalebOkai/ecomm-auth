import { Prisma } from "@prisma/client";

import { decryptPassword } from "../../utils/crypto";
import { ValidationError } from "../../errors";
import { prismaClient } from "..";
import { CreateNonAuthModel } from "../types";



/**********************/
/** Validate Password */
export const validatePassword = async (
  args: CreateNonAuthModel<{
    userId: string;
    password: string
  }>
): Promise<boolean> => {
  const { prismaTxn, fields } = args;
  const { userId, password } = fields;
  const prisma = prismaTxn || prismaClient;
  const userPassword = await prisma.password.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  if (userPassword) {
    const { salt, hash } = userPassword;
    return await decryptPassword(password, salt, hash);
  }
  return false;
}


/**********************************************/
/** Ensure Password Matches strength Criteria */
export const checkPasswordStrength = (
  password: string,
  username: string
) => {
  // Escape special characters in the username for use in the regex
  const escapedUsername = username.replace(
    /[-/\\^$*+?.()|[\]{}]/g,
    '\\$&'
  );
  // Create a regex pattern to check password criteria and
  // ensure it does not contain the username
  const pattern = new RegExp(
    `^(?!.*${escapedUsername})(?=.*\\d)(?=.*[a-z])${""
    }(?=.*[A-Z]).{8,}$`
  );
  if (!pattern.test(password)) {
    throw new ValidationError("", {
      details: [
        `Your password must:${"\n"
        }- Not contain your Email.${"\n"
        }- Be at least 8 characters.${"\n"
        }- Include at least one number.${"\n"
        }- Include at least one uppercase letter.${"\n"
        }- Include at least one lowercase letter.`
      ]
    });
  }

  return true;
}


export const generateValidPassword = (username: string) => {
  const length = 12;
  const charset = (
    `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLM${""
    }NOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?`
  );

  const getRandomChar = (characters: string) => (
    characters[Math.floor(Math.random() * characters.length)]
  );

  const generatePassword = () => {
    let password = "";
    password += getRandomChar(
      "abcdefghijklmnopqrstuvwxyz"
    ); // Add one lowercase letter
    password += getRandomChar(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    ); // Add one uppercase letter
    password += getRandomChar(
      "0123456789"
    ); // Add one digit
    password += getRandomChar(
      "!@#$%^&*()_+[]{}|;:,.<>?"
    ); // Add one special character
    // Fill the rest of the password length with
    // random characters from the charset
    for (let i = 4; i < length; i++) {
      password += getRandomChar(charset);
    }

    // Shuffle the password to ensure randomness
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    // Ensure the password is at least the specified length
    if (password.length < length) {
      while (password.length < length) {
        password += getRandomChar(charset);
      }
    }

    return password;
  };
  let password;
  do {
    password = generatePassword();
  } while (password.includes(username));

  return password;
}