import { Resolver, Mutation, Arg } from "type-graphql";
import { v4 } from "uuid";
import { configBuildAndValidate } from "./config.build-config";

import { redis } from "./config.redis";
import { forgotPasswordPrefix } from "./constants";
import { User } from "./entity.user";
import { sendEmail } from "./lib.send-email";

@Resolver()
export class ForgotPassword {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const temp = await configBuildAndValidate();
    const config = temp.getProperties();
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24); // 1 day expiration

    await sendEmail(email, `http://${config.host}/change-password/${token}`);

    return true;
  }
}
