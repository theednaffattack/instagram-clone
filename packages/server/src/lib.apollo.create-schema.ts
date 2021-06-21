import { GraphQLSchema } from "graphql";
import { buildSchemaSync, ResolverData } from "type-graphql";

import { pubsub } from "./config.redis";
import { ResolveTime } from "./middleware.resolve-time";
import { GetMessagesByThreadId } from "./resolver.get-messages-by-thread-id";
import { GetOnlyThreads } from "./resolver.get-only-threads";
import { HelloWorldResolver } from "./resolver.hello-world";
import { LoginResolver } from "./resolver.login";
import { MeResolver } from "./resolver.me";
import { RegisterResolver } from "./resolver.register";
import { MyContext } from "./typings";

export function createSchema(): GraphQLSchema {
  return buildSchemaSync({
    authChecker: AuthorizationChecker,
    dateScalarMode: "isoDate",
    pubSub: pubsub,
    // Keep 'resolvers' below alphabetical please!
      GetMessagesByThreadId,
    globalMiddlewares: [ResolveTime],
  });
}

function AuthorizationChecker({ context: { req } }: ResolverData<MyContext>): boolean {
  console.log(Object.keys(req));
  return true;
}
