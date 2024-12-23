import { User } from "@prisma/client";



export type SendVerficationCodeArgs = {
  type: "code" | "link";
  user: User;
}