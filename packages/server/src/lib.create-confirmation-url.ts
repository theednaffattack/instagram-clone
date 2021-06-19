import { configBuildAndValidate } from "./config.build-config";
import { redis } from "./config.redis";
import { confirmUserPrefix } from "./constants";

export const createConfirmationUrl = async (userId: string) => {
  let config;
  try {
    const initialConfig = await configBuildAndValidate();
    config = initialConfig.getProperties();
  } catch (configInitError) {
    console.error("SERVER CONFIG ERROR", configInitError);
    throw Error(`Config init error!\n${configInitError}`);
  }

  // const token = v4();
  await redis.set(confirmUserPrefix + userId, userId, "ex", 60 * 60 * 24); // 1 day expiration

  return `http://${config.host}/confirmation/${userId}`;
};
