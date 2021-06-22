import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { UserResponse } from "./gql-type.user-response";
import { redis } from "./config.redis";
import { forgotPasswordPrefix } from "./constants";
import { User } from "./entity.user";
import { ChangePasswordInput } from "./gql-type.change-password-input";
import { MyContext } from "./typings";

@Resolver()
export class ChangePassword {
  @Mutation(() => UserResponse, { nullable: true })
  async changePassword(
    @Arg("data")
    { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const userId = await redis.get(forgotPasswordPrefix + token);
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

    const user = await User.findOne(userId);

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
    await redis.del(forgotPasswordPrefix + token);

    // security
    user.password = await bcrypt.hash(password, 12);

    // save updated password
    await user.save();

    // optional - login in the user

    (ctx.req.session! as any).userId = user.id;

    return {
      user,
    };
  }
}
