import { configBuildAndValidate } from "./config.build-config";
import { returnRedisInstance } from "./config.redis";
import { confirmUserPrefix } from "./constants";

export async function createConfirmationUrl(userId: string): Promise<string> {
  let config;

  try {
    config = await configBuildAndValidate();
  } catch (configInitError) {
    console.error("SERVER CONFIG ERROR", configInitError);
    throw Error(`Config init error!\n${configInitError}`);
  }

  let redis;
  try {
    redis = await returnRedisInstance(config);
  } catch (error) {
    console.error("ERROR GETTING REDIS INSTANCE - CREATE CONFIRMATION EMAIL");
    console.error(error);
    throw Error(error);
  }

  await redis.set(confirmUserPrefix + userId, userId, "ex", 60 * 60 * 24); // 1 day expiration

  return `http://${config.host}/confirmation/${userId}`;
}
