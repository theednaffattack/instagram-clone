import { GraphQLSchema } from "graphql";
import { buildSchemaSync } from "type-graphql";
import { pubsub } from "./redis";
import { HelloWorldResolver } from "./resolver.hello-world";
import { LoginResolver } from "./resolver.login";

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
    resolvers: [HelloWorldResolver, LoginResolver],
  });
}
