import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";
import { configBuildAndValidate } from "./config.build-config";
import { returnRedisInstance } from "./config.redis";
// import { redis } from "./config.redis";
import { forgotPasswordPrefix } from "./constants";
import { User } from "./entity.user";
import { handleAsyncSimple, handleAsyncWithArgs } from "./lib.handle-async";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";
import { sendEmail } from "./lib.send-email";
import { MyContext } from "./typings";

@Resolver()
export class ForgotPassword {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string, @Ctx() ctx: MyContext): Promise<boolean> {
    const [config, configError] = await handleAsyncSimple(configBuildAndValidate);

    if (configError) {
      handleCatchBlockError(configError);
    }

    const [user, userError] = await handleAsyncWithArgs(ctx.dbConnection.getRepository(User).findOne, [
      { where: { email } },
    ]);

    if (userError) {
      handleCatchBlockError(userError);
    }

    if (!user) {
      return true;
    }

    const token = v4();

    const [redis, redisError] = await handleAsyncSimple(returnRedisInstance);
    if (redisError) {
      logger.error("ERROR GETTING REDIS INSTANCE - CREATE CONFIRMATION EMAIL");
      handleCatchBlockError(redisError);
    }

    const [, redisSetError] = await handleAsyncWithArgs(redis.set, [
      forgotPasswordPrefix + token,
      user.id,
      "ex",
      60 * 60 * 24,
    ]); // 1 day expiration
    if (redisSetError) {
      handleCatchBlockError(redisSetError);
    }

    const [, emailError] = await handleAsyncWithArgs(sendEmail, [
      email,
      `http://${config.host}/change-password/${token}`,
    ]);

    if (emailError) {
      handleCatchBlockError(emailError);
    }

    return true;
  }
}
