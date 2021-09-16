import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { configBuildAndValidate } from "./config.build-config";
import { returnRedisInstance } from "./config.redis";
import { confirmUserPrefix } from "./constants";
import { User } from "./entity.user";
import { handleAsyncSimple, handleAsyncWithArgs } from "./lib.handle-async";
import { handleCatchBlockCustomError } from "./lib.handle-catch-block-custom-error";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";
import { MyContext } from "./typings";

@Resolver()
export class ConfirmUser {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string, @Ctx() ctx: MyContext): Promise<boolean> {
    const [redis, redisError] = await handleAsyncSimple(returnRedisInstance);

    if (redisError) {
      logger.error("ERROR GETTING REDIS INSTANCE - CREATE CONFIRMATION EMAIL");
      handleCatchBlockError(redisError);
    }

    const [userId, userIdError] = await handleAsyncWithArgs(redis.get, [confirmUserPrefix + token]);
    if (userIdError) {
      logger.error("USER CONFIRMATION");
      handleCatchBlockError(userIdError);
    }

    if (!userId) {
      return false;
    }

    const [config, configError] = await handleAsyncSimple(configBuildAndValidate);

    if (configError) {
      logger.error("ERROR GETTING CONFIG - CONFIRM USER");
      handleCatchBlockError(configError);
    }

    // Update the user to be confirmed and remove the token from redis
    const [, updatedUserError] = await handleAsyncWithArgs(getConnection(config.env).getRepository(User).update, [
      { id: userId },
      { confirmed: true },
    ]);
    if (updatedUserError) {
      logger.error({ updatedUserError });
      throw new Error("User confirmation error.");
    }

    const [, redisDeleteError] = await handleAsyncWithArgs(redis.del, [confirmUserPrefix + token]);
    if (redisDeleteError) {
      logger.error({ redisDeleteError });
      throw Error(`User token deletion error:\n${redisDeleteError}`);
    }

    // TODO: LOG THEM IN!!!

    // ctx.req.session!.userId = userId;

    return true;
  }
}
