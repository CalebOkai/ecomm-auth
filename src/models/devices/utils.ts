import useragent from "useragent";

import { DeviceMetadata } from "./types";



/**********************************************
 * **Get Device metadata from Request Headers**
 * @param req Express.js request object 
 */
export const getDeviceMetaData = async (
  req: any
): Promise<DeviceMetadata> => {
  const agent = useragent.parse(req.headers["user-agent"]);
  req.useragent = agent;
  const deviceInfo = (
    `${req.useragent.os.toString()
    },${req.useragent.device.toString()}`
  );
  const browserInfo = req.useragent.toAgent();
  const forwarded = req.headers["x-forwarded-for"];
  const ipAddress = forwarded
    ? forwarded.split(',')[0]
    : req.connection.remoteAddress;
  const deviceMetaData = {
    deviceInfo,
    browserInfo,
    ipAddress
  }

  return deviceMetaData;
}