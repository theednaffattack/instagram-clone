import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { UserResponse } from "./gql-type.user-response";
// import { redis } from "./config.redis";
import { forgotPasswordPrefix } from "./constants";
import { User } from "./entity.user";
import { ChangePasswordInput } from "./gql-type.change-password-input";
import { MyContext } from "./typings";
import { returnRedisInstance } from "./config.redis";
import { handleAsyncSimple, handleAsyncWithArgs } from "./lib.handle-async";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";

@Resolver()
export class ChangePassword {
  @Mutation(() => UserResponse, { nullable: true })
  async changePassword(
    @Arg("data")
    { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const [redis, redisError] = await handleAsyncSimple(returnRedisInstance);
    if (redisError) {
      logger.error("ERROR GETTING REDIS INSTANCE - CREATE CONFIRMATION EMAIL");
      handleCatchBlockError(redisError);
    }

    const [userId, userIdError] = await handleAsyncWithArgs(redis.get, [forgotPasswordPrefix + token]);
    if (userIdError) {
      logger.error("ERROR GETTING USER ID FROM REDIS INSTANCE");
      handleCatchBlockError(userIdError);
    }

    // token expired in redis, possibly bad token
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "invalid token",
          },
        ],
      };
    }

    const [user, userError] = await handleAsyncWithArgs(ctx.dbConnection.getRepository(User).findOne, [userId]);
    if (userError) {
      handleCatchBlockError(userError);
    }
    // can't find a user in the db
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    // don't allow this token to be used to change
    // password again
    const [, redisDelError] = await handleAsyncWithArgs(redis.del, [forgotPasswordPrefix + token]);

    if (redisDelError) {
      handleCatchBlockError(redisDelError);
    }

    const [hashedPassword, hashedPasswordError] = await handleAsyncWithArgs(bcrypt.hash, [password, 12]);

    if (hashedPasswordError) {
      handleCatchBlockError(hashedPasswordError);
    }

    // security
    user.password = hashedPassword;

    // save updated password
    const [, savedUserError] = await handleAsyncSimple(user.save);

    if (savedUserError) {
      handleCatchBlockError(savedUserError);
    }

    // optional - login in the user

    (ctx.req.session! as any).userId = user.id;

    return {
      user,
    };
  }
}
