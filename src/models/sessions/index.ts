import { default401 } from "../../errors/defaultMsgs";
import { SessionInfo } from "../../middleware/types";
import { UnauthorizedError } from "../../errors";
import { prismaClient } from "..";
import {
  getSessionMetadata,
  setSessionExpiry
} from "./utils";



/********************************************************/
/****Update an existing `Session` with request Metadata**
 * @param token Session ID (token).
 * @param sessionInfo An object containing relevant session metadata.
 * @throws `Unauthorized` if the session is not found.
 * @returns The `Session` instance updated with the metadata. */
export const refreshSession = async (
  token: string,
  sessionInfo?: SessionInfo
) => {
  const prisma = prismaClient;
  const metadata = getSessionMetadata(sessionInfo);
  const expiresAt = setSessionExpiry(7);
  const data = {
    ...metadata,
    expiresAt
  }
  const session = await prisma.session.findUnique({
    where: { token }
  });
  if (!session) {
    throw new UnauthorizedError("", default401);
  }
  const updatedSession = await prisma.session.update({
    where: {
      token,
    },
    data,
    include: {
      user: true
    }
  });

  return updatedSession;
}