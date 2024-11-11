import { addDays } from "date-fns";
import { validString } from "../../validators";



/****************************************/
/** Set expiry date for a login session */
export const setSessionExpiry = (days: number) => {
  const expiresAt = addDays(new Date, days)

  return expiresAt;
}


/************************************************/
/** Return optional session fields if available */
export const getSessionMetadata = (fields: any) => {
  if (!fields) return {};
  const { ipAddress, deviceInfo, browserInfo } = fields;
  const metadata = {
    ...(validString(ipAddress) ? {
      ipAddress
    } : {}),
    ...(validString(deviceInfo) ? {
      deviceInfo
    } : {}),
    ...(validString(browserInfo) ? {
      browserInfo
    } : {})
  }

  return metadata;
}