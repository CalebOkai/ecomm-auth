import { NotFoundError } from "../../errors";
import { capitalize } from "../../utils/strings";
import { prismaClient } from "..";
import { ModelByIdArgs } from "./types";



/*************************************/
/** Retrieves a model instance by ID */
export const getModelById = async ({
  id,
  model,
  prisma: prismaTxn,
  include,
  throwError = true,
}: ModelByIdArgs) => {
  const prisma = prismaTxn || prismaClient as any;
  const findUniqueParams: any = {
    where: { id },
  };
  if (include) {
    findUniqueParams["include"] = include;
  }
  const instance = await prisma[model].findUnique(findUniqueParams);
  if (!instance) {
    if (throwError) {
      const modelName = capitalize(model as string);
      throw new NotFoundError("", {
        details: [`No ${modelName} with ID '${id}' found.`]
      });
    } else {
      return null;
    }
  }

  return instance;
}


/*************************************/
/** Deletes a model instance by ID */
export const deleteModelById = async ({
  id,
  model,
  prisma: prismaTxn,
  throwError = true,
}: ModelByIdArgs): Promise<boolean> => {
  const prisma = prismaTxn || prismaClient as any;
  const instance = await getModelById({
    id,
    model,
    prisma: prismaTxn,
    throwError
  });
  if (!instance) return true;
  await prisma[model].delete({
    where: { id }
  });

  return true;
}