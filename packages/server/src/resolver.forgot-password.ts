import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { v4 } from "uuid";
import { configBuildAndValidate } from "./config.build-config";
import { returnRedisInstance } from "./config.redis";

// import { redis } from "./config.redis";
import { forgotPasswordPrefix } from "./constants";
import { User } from "./entity.user";
import { sendEmail } from "./lib.send-email";
import { MyContext } from "./typings";

@Resolver()
export class ForgotPassword {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string, @Ctx() ctx: MyContext): Promise<boolean> {
    const config = await configBuildAndValidate();
    let user;

    try {
      user = await ctx.dbConnection.getRepository(User).findOne({ where: { email } });
    } catch (error) {
      console.error(error);
      throw Error(error);
    }

    if (!user) {
      return true;
    }

    const token = v4();

    let redis;
    try {
      redis = await returnRedisInstance();
    } catch (error) {
      console.error("ERROR GETTING REDIS INSTANCE - CREATE CONFIRMATION EMAIL");
      console.error(error);
      throw Error(error);
    }

    await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24); // 1 day expiration

    await sendEmail(email, `http://${config.host}/change-password/${token}`);

    return true;
  }
}
