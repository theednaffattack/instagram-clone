import { ServerConfigProps } from "./config.build-config";
import { User } from "./entity.user";
import { createAccessToken } from "./lib.authentication";
import { addDays, addMinutes, addSeconds } from "./lib.utilities.manipulate-time";

/**
 * ExpireUnit
 *
 * "m" = months
 *
 * "s" = seconds
 *
 * "d" = days
 */
type ExpireUnit = "m" | "s" | "d" | "months" | "seconds" | "days";
interface CreateTokenDataProps {
  config: ServerConfigProps;
  user: User;
  expireUnit: ExpireUnit;
  expireInt: number;
}
export function createTokenData({ config, user, expireUnit = "m", expireInt = 15 }: CreateTokenDataProps) {
  const expireString = `${expireInt}${expireUnit}`;
  let expiresIn: Date;

  switch (expireUnit) {
    case "d":
    case "days":
      expiresIn = addDays(new Date(), expireInt);
      return {
        accessToken: createAccessToken({ config: config, user, expiresIn: expireString }),
        expiresIn,
        userId: user.id,
        version: user.tokenVersion,
      };
    case "m":
    case "months":
      expiresIn = addMinutes(new Date(), expireInt);
      return {
        accessToken: createAccessToken({ config: config, user, expiresIn: expireString }),
        expiresIn,
        userId: user.id,
        version: user.tokenVersion,
      };
    case "s":
    case "seconds":
      expiresIn = addSeconds(new Date(), expireInt);
      return {
        accessToken: createAccessToken({ config: config, user, expiresIn: expireString }),
        expiresIn,
        userId: user.id,
        version: user.tokenVersion,
      };

    // Default case matches "m" case above
    default:
      expiresIn = addMinutes(new Date(), expireInt);
      return {
        accessToken: createAccessToken({ config: config, user, expiresIn: expireString }),
        expiresIn,
        userId: user.id,
        version: user.tokenVersion,
      };
  }
}
