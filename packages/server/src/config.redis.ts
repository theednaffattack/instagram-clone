import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

const nodeEnvIs_NOT_Prod = process.env.NODE_ENV !== "production";

const developmentOptions: Redis.RedisOptions = {
  host: process.env.REDIS_HOST,
  name: "myredis",
  port: parseInt(process.env.REDIS_PORT!, 10),
  retryStrategy: (times: any) => Math.max(times * 100, 3000),
  showFriendlyErrorStack: true,
};

const productionOptions: Redis.RedisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!, 10), // parseInt(process.env.REDIS_INTERIOR_PORT!, 10),
  name: "myredis",
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: any) => Math.max(times * 100, 3000),
  showFriendlyErrorStack: true,
};

const developmentPubsubOptions: Redis.RedisOptions = {
  host: process.env.REDIS_HOST,
  name: "pubsubredis",
  port: parseInt(process.env.REDIS_PORT!, 10),
  retryStrategy: (times: any) => Math.max(times * 100, 3000),
  showFriendlyErrorStack: true,
};

const productionPubsubOptions: Redis.RedisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!, 10), // parseInt(process.env.REDIS_INTERIOR_PORT!, 10),
  name: "pubsubRedis",
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: any) => Math.max(times * 100, 3000),
  showFriendlyErrorStack: true,
};

export function redisError(error: Error) {
  console.warn("redis error", {
    error,
    developmentOptions,
    productionOptions,
    env: process.env.NODE_ENV,
    isNotProd: nodeEnvIs_NOT_Prod,
  });
}

export function redisReady() {
  console.log("redis is ready");
}
export function pubsubError(error: Error) {
  console.warn("redis pubsub error", {
    error,
    developmentPubsubOptions,
    productionPubsubOptions,
    env: process.env.NODE_ENV,
    isNotProd: nodeEnvIs_NOT_Prod,
  });
}

export function pubsubReady() {
  console.log("redis pubsub is ready");
}

export const redis =
  process.env.NODE_ENV !== "production" ? new Redis(developmentOptions) : new Redis(productionOptions); // new Redis(productionOptions);

redis.on("error", redisError);

redis.on("ready", redisReady);

const pubRedis = nodeEnvIs_NOT_Prod ? new Redis(developmentPubsubOptions) : new Redis(productionPubsubOptions);

const subRedis = nodeEnvIs_NOT_Prod ? new Redis(developmentPubsubOptions) : new Redis(productionPubsubOptions);

pubRedis.on("error", pubsubError);
pubRedis.on("ready", pubsubError);

subRedis.on("error", pubsubError);
subRedis.on("ready", pubsubError);

export const pubsub = new RedisPubSub({
  // ...,
  publisher: pubRedis,
  subscriber: subRedis,
});
