import { Prisma } from "@prisma/client";




export type CreateLoginAttempt = {
  fields: Prisma.LoginAttemptCreateInput,
}

export type UpdateLoginAttempt = {
  id: number,
  fields: Prisma.LoginAttemptUpdateInput
}