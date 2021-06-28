import { SubscriptionServerOptions } from "apollo-server-core";
import session from "express-session";
import type { RequestHandler } from "express";
import type { ParsedQs } from "qs";
import type { ParamsDictionary } from "express-serve-static-core";
import connectRedis from "connect-redis";

// import { redis } from "./config.redis";
import { redisSessionPrefix } from "./constants";
import { ServerConfigProps } from "./config.build-config";
import { returnRedisInstance } from "./config.redis";

const RedisStore = connectRedis(session);

type SessionMiddle = RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;

export async function configSessionMiddleware(config: ServerConfigProps): Promise<SessionMiddle> {
  const redis = await returnRedisInstance(config);
  let sessionMiddleware: SessionMiddle;

  // old cookie implentation
  if (config.env === "production") {
    sessionMiddleware = session({
      cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
        domain: config.domain,
        path: "/",
      },
      name: config.cookieName,
      resave: false,
      saveUninitialized: false,
      secret: config.secret,
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix,
      }),
    });
  } else {
    sessionMiddleware = session({
      name: config.cookieName,
      secret: config.secret,
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix,
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
        domain: config.domain,
      },
    });
  }
  return sessionMiddleware;
}

export function configGraphQLSubscriptions(sessionMiddleware: SessionMiddle): Partial<SubscriptionServerOptions> {
  return {
    path: "/subscriptions",
    onConnect: (_, ws: any) => {
      console.log("Client connected");
      return new Promise((res) =>
        sessionMiddleware(ws.upgradeReq, {} as any, () => {
          res({ req: ws.upgradeReq });
        })
      );
    },
    onDisconnect: (_webSocket, _context) => {
      console.log("Client disconnected");
    },
  };
}
