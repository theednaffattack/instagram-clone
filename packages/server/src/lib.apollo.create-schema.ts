import { GraphQLSchema } from "graphql";
import { buildSchemaSync, ResolverData } from "type-graphql";

import { pubsub } from "./config.redis";
import { ResolveTime } from "./middleware.resolve-time";
import { MyContext } from "./typings";

import { GetMessagesByThreadId } from "./resolver.get-messages-by-thread-id";
import { GetOnlyThreads } from "./resolver.get-only-threads";
import { HelloWorldResolver } from "./resolver.hello-world";
import { LoginResolver } from "./resolver.login";
import { MeResolver } from "./resolver.me";
import { RegisterResolver } from "./resolver.register";
import { GetListToCreateThread } from "./resolver.get-list-to-create-thread";
import { GetGlobalPosts } from "./resolver.get-global-posts";
import { GetGlobalPostsSimplePagination } from "./resolver.get-global-posts-simple-pagination";
import { GetGlobalPostsRelay } from "./resolver.get-global-posts-relay";
import { SignS3 } from "./resolver.sign-s3";

export function createSchema(): GraphQLSchema {
  return buildSchemaSync({
    authChecker: AuthorizationChecker,
    dateScalarMode: "isoDate",
    pubSub: pubsub,
    // Keep 'resolvers' below alphabetical please!
    resolvers: [
      GetGlobalPosts,
      GetGlobalPostsRelay,
      GetGlobalPostsSimplePagination,
      GetListToCreateThread,
      GetMessagesByThreadId,
      GetOnlyThreads,
      HelloWorldResolver,
      LoginResolver,
      MeResolver,
      RegisterResolver,
      SignS3,
    ],
    globalMiddlewares: [ResolveTime],
  });
}

function AuthorizationChecker({ context: { req } }: ResolverData<MyContext>): boolean {
  console.log(Object.keys(req));
  return true;
}
