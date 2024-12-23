import { validateDataOnCreate } from "./validation";
import { CreateModel } from "../types";
import { prismaClient } from "..";



/*****************
 * **Create User**
 * @param args `CreateModel`
 */
export const createUser = async (
  args: CreateModel<any>
) => {
  const { prismaTxn } = args;
  const prisma = prismaTxn || prismaClient;
  const validatedData = await validateDataOnCreate({
    ...args,
    prisma
  });
  const newUser = await prisma.user.create({
    data: validatedData
  });

  return newUser;
}