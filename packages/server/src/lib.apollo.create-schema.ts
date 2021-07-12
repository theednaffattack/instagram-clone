import { GraphQLSchema } from "graphql";
import { buildSchemaSync, ResolverData } from "type-graphql";

// import { pubsub } from "./config.redis";
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
import { ForgotPassword } from "./resolver.forgot-password";
import { CreatePost } from "./resolver.create-post";
import { CreateOrUpdateLikes } from "./resolver.create-or-update-likes";
import { ConfirmUser } from "./resolver.confirm-user";
import { ChangePassword } from "./resolver.change-password";
import { AddMessageToThread } from "./resolver.add-message-to-thread";
import { CreateMessageThread } from "./resolver.create-message-thread";
import { Logout } from "./resolver.logout";
import { GetGlobalPostById } from "./resolver.get-global-posts-by-id";
import { returnPubsubRedisInstance } from "./config.redis";
import { HelloWithUserInput } from "./resolver.hello-with-user-input";

export async function createSchema(): Promise<GraphQLSchema> {
  const pubsub = await returnPubsubRedisInstance();
  return buildSchemaSync({
    authChecker: AuthorizationChecker,
    dateScalarMode: "isoDate",
    pubSub: pubsub,
    // Keep 'resolvers' below alphabetical please!
    resolvers: [
      AddMessageToThread,
      ChangePassword,
      ConfirmUser,
      CreateMessageThread,
      CreateOrUpdateLikes,
      CreatePost,
      ForgotPassword,
      GetGlobalPosts,
      GetGlobalPostById,
      GetGlobalPostsRelay,
      GetGlobalPostsSimplePagination,
      GetListToCreateThread,
      GetMessagesByThreadId,
      GetOnlyThreads,
      HelloWithUserInput,
      HelloWorldResolver,
      LoginResolver,
      Logout,
      MeResolver,
      RegisterResolver,
      SignS3,
    ],
    // globalMiddlewares: [ResolveTime],
  });
}

function AuthorizationChecker({ context: { req } }: ResolverData<MyContext>): boolean {
  console.log(Object.keys(req));
  return true;
}
