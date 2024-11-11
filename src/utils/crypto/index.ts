import crypto from "crypto";

import { CryptoPassword } from "./types";
import CryptoSettings from "./settings";



/*********************/
/** Decrypt Password */
export const decryptPassword = async (
  password: string,
  salt: string,
  hash: Buffer,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      CryptoSettings.iterations,
      CryptoSettings.keylen,
      CryptoSettings.digest,
      (err, hashedPassword) => {
        if (err) {
          return reject(err);
        }
        if (!crypto.timingSafeEqual(hash, hashedPassword)) {
          return resolve(false);
        }
        return resolve(true);
      },
    );
  });
}


/*********************/
/** Encrypt Password */
export const encryptPassword = async (
  password: string | number,
): Promise<CryptoPassword> => {
  const salt = await randomHexString(CryptoSettings.keylen);
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password.toString(),
      salt,
      CryptoSettings.iterations,
      CryptoSettings.keylen,
      CryptoSettings.digest,
      (err, hash) => {
        if (err) {
          return reject(err);
        }
        return resolve({
          salt,
          hash,
        });
      },
    );
  });
}


export const randomHexString = async (
  hexLength: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(hexLength, (err, buffer) => {
      if (err) {
        return reject(err);
      }

      return resolve(buffer.toString("hex"));
    });
  });
}


export const randomDigits = (
  digitLength: number
): number => {
  const exp = Math.pow(10, digitLength);
  return Math.floor(exp + Math.random() * 9 * exp);
}