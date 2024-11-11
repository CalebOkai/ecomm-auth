import { PrismaClient } from "@prisma/client";



export type ModelByIdArgs = {
  id: number | string;
  model: keyof PrismaClient;
  prisma?: any;
  throwError?: boolean;
  include?: any
}