import { GraphQLSchema } from "graphql";
import { buildSchemaSync } from "type-graphql";
import { pubsub } from "./config.redis";
import { ResolveTime } from "./middleware.resolve-time";
import { HelloWorldResolver } from "./resolver.hello-world";
import { LoginResolver } from "./resolver.login";
import { MeResolver } from "./resolver.me";
import { RegisterResolver } from "./resolver.register";

export function createSchema(): GraphQLSchema {
  return buildSchemaSync({
    authChecker: ({ context: { req } }) => {
      // I can read context here
      // check permission vs what's in the db "roles" argument
      // that comes from `@Authorized`, eg,. ["ADMIN", "MODERATOR"]
      // return !!req.session.userId;
      console.log(Object.keys(req));

      return true;
    },
    dateScalarMode: "isoDate",
    pubSub: pubsub,
    // Keep 'resolvers' below alphabetical please!
    resolvers: [HelloWorldResolver, LoginResolver, MeResolver, RegisterResolver],

    globalMiddlewares: [ResolveTime],
  });
}
