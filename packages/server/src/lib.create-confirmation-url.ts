import { config } from "./config.build-config";
import { redis } from "./config.redis";
import { confirmUserPrefix } from "./constants";

export const createConfirmationUrl = async (userId: string) => {
  // const token = v4();
  await redis.set(confirmUserPrefix + userId, userId, "ex", 60 * 60 * 24); // 1 day expiration

  return `http://${config.host}/confirmation/${userId}`;
};
