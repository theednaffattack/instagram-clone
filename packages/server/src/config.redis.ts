import { RedisPubSub } from "graphql-redis-subscriptions";
import { RequestHeaderFieldsTooLarge } from "http-errors";
import Redis from "ioredis";
import { configBuildAndValidate, ServerConfigProps } from "./config.build-config";

export function redisError(error: Error, config: any) {
  console.warn("redis error", {
    error,
    env: process.env.NODE_ENV,
  });
}

export function redisReady() {
  console.log("redis is ready");
}
export function pubsubError(error: Error, type: string) {
  console.error(`redis ${type} error`, {
    error,
    env: process.env.NODE_ENV,
  });
  throw error;
}

export function pubsubReady(type: string): void {
  console.log(`redis ${type} is ready`);
}

export async function returnRedisInstance(config?: ServerConfigProps): Promise<Redis.Redis> {
  let realConfig: ServerConfigProps;

  if (!config) {
    realConfig = await configBuildAndValidate();
  } else {
    realConfig = config;
  }

  const redis = new Redis(realConfig.redis.connectionString);

  redis.on("error", (error) => {
    redisError(error, realConfig);
  });
  redis.on("ready", redisReady);

  return redis;
}

export async function returnPubsubRedisInstance(config?: ServerConfigProps): Promise<RedisPubSub> {
  let realConfig: ServerConfigProps;

  if (!config) {
    realConfig = await configBuildAndValidate();
  } else {
    realConfig = config;
  }

  const publisher = new Redis(realConfig.redis.connectionString);
  const subscriber = new Redis(realConfig.redis.connectionString);

  publisher.on("error", (error) => pubsubError(error, "publisher"));
  publisher.on("ready", () => pubsubReady("publisher"));

  subscriber.on("error", (error) => {
    console.log("IS THIS ANYTHING?", error);

    pubsubError(error, "subscriber");
  });
  subscriber.on("ready", () => pubsubReady("subscriber"));

  const newPubsub = new RedisPubSub({
    publisher,
    subscriber,
  });

  return newPubsub;
}
