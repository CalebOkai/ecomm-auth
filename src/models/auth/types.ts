import { User } from "@prisma/client";



export type EmailSignInData = {
  email: string;
  password: string;
}
export type PhoneSignInData = {
  countryCode: string;
  phoneNumber: string;
}

export const isEmailSignInData = (
  data: any
): data is EmailSignInData => {
  return "email" in data && "password" in data;
}

export const isPhoneSignInData = (
  data: any
): data is PhoneSignInData => {
  return "countryCode" in data && "phoneNumber" in data;
}

export type SignInResponse = {
  user: User;
  token: string;
} | {
  user: User;
  verification: boolean;
}