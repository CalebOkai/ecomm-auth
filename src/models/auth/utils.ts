import { differenceInDays } from "date-fns";
import { User } from "@prisma/client";

import { UnauthorizedError } from "../../errors";



/******************************************/
/****Handle a potentially archived `User`**
 * @param user
 * @throws `Unauthorized` if the user account has been archived.
 * @returns The `User` instance if the account is not suspended.*/
export const handleArchivedUser = async (
  user: User
) => {
  // Handle Archived User
  if (user.archivedAt) {
    const daysLeft = (30 - differenceInDays(new Date(), user.updatedAt));
    const days = daysLeft === 1 ? "day" : "days";
    let errorMsg = (
      `Your account has been suspended and would be permanently archived${" "
      }in ${daysLeft} ${days}.${"\n\n"
      }If you would like to restore your account before it's suspended,${" "
      }please contact Support.`
    );
    if (daysLeft <= 0) {
      errorMsg = (
        `Your account has been permanently archived.${"\n"
        }If you would like to restore your account,${" "
        }please contact Support.`
      );
    }

    throw new UnauthorizedError("", {
      details: [errorMsg]
    });
  }

  return user;
}