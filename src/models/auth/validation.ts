import { cleanEmail, cleanString } from "../../utils/strings";
import { deepJSONParse, validString } from "../../validators";
import { EmailSignInData, PhoneSignInData } from "./types";
import { ValidateCreateNonAuthModel } from "../types";
import { ValidationError } from "../../errors";



/******************************
 * **Validate Data on Sign In**
 * @param args `ValidateCreateNonAuthModel`
 * @returns `EmailSignInData` or `PhoneSignInData` */
export const validateSignIn = async (
  args: ValidateCreateNonAuthModel<any>
) => {
  const { fields } = args;
  const { countryCode, phoneNumber } = fields;
  const parsedData = deepJSONParse(JSON.stringify(fields));
  const { email, password } = parsedData;
  if (validString(email) && validString(password)) {
    const emailSignInData: EmailSignInData = {
      email: cleanEmail(email),
      password
    }

    return emailSignInData;
  } else if (validString(countryCode) && validString(phoneNumber)) {
    const phoneSignInData: PhoneSignInData = {
      countryCode: cleanString(countryCode),
      phoneNumber: cleanString(phoneNumber)
    }

    return phoneSignInData;
  } else {
    throw new ValidationError("", {
      details: ["Invalid Credentials. Try that again."]
    });
  }
}