import { configBuildAndValidate } from "./config.build-config";
import { returnRedisInstance } from "./config.redis";
import { confirmUserPrefix } from "./constants";
import { handleAsyncWithArgs } from "./lib.handle-async";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";

export async function createConfirmationUrl(userId: string): Promise<string> {
  let config;

  try {
    config = await configBuildAndValidate();
  } catch (configInitError) {
    console.error("SERVER CONFIG ERROR", configInitError);
    throw Error(`Config init error!\n${configInitError}`);
  }

  const [redis, redisError] = await handleAsyncWithArgs(returnRedisInstance, [config]);

  if (redisError) {
    logger.error("ERROR GETTING REDIS INSTANCE - CREATE CONFIRMATION EMAIL");
    handleCatchBlockError(redisError);
  }

  const [, redisSetError] = await handleAsyncWithArgs(redis.set, [
    confirmUserPrefix + userId,
    userId,
    "ex",
    60 * 60 * 24, // 1 day expiration
  ]);
  if (redisSetError) {
    handleCatchBlockError(redisSetError);
  }
  // redis.set(confirmUserPrefix + userId, userId, "ex", 60 * 60 * 24); // 1 day expiration

  return `http://${config.host}/confirmation/${userId}`;
}
