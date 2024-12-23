import { Device } from "@prisma/client";

import { default401 } from "../../errors/defaultMsgs";
import { UnauthorizedError } from "../../errors";
import { getDeviceMetaData } from "./utils";
import { GetNonAuthModel } from "../types";
import { prismaClient } from "..";



/***********************************************
 * **Get or create a new `Device` via metadata**
 * @param req Express.js request object 
 */
export const getOrCreateDevice = async (
  req: any
): Promise<Device> => {
  const prisma = prismaClient;
  const metaData = await getDeviceMetaData(req);
  const existingDevice = await prisma.device.findFirst({
    where: metaData
  });
  if (!existingDevice) {
    return await prisma.device.create({
      data: metaData
    });
  } else {
    if (existingDevice.state === "blocked") {
      throw new UnauthorizedError("", default401);
    }
  }

  return existingDevice;
}


/****************************************************
 * **Check if a device has been previously verified**
 * @param args Get Model (non-authenticated)
 */
export const verifiedDevice = async (
  args: GetNonAuthModel<string>
) => {
  const { prismaTxn, id } = args;
  const prisma = prismaTxn || prismaClient;
  const verifiedDevice = await prisma.device.findFirst({
    where: {
      id,
      verifiedDevices: {
        some: {}
      }
    }
  });

  return verifiedDevice;
}