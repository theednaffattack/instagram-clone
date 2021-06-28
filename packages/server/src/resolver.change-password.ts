import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { UserResponse } from "./gql-type.user-response";
// import { redis } from "./config.redis";
import { forgotPasswordPrefix } from "./constants";
import { User } from "./entity.user";
import { ChangePasswordInput } from "./gql-type.change-password-input";
import { MyContext } from "./typings";
import { returnRedisInstance } from "./config.redis";

@Resolver()
export class ChangePassword {
  @Mutation(() => UserResponse, { nullable: true })
  async changePassword(
    @Arg("data")
    { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    let redis;
    let userId;

    try {
      redis = await returnRedisInstance();
    } catch (error) {
      console.error("ERROR GETTING REDIS INSTANCE - CREATE CONFIRMATION EMAIL");
      console.error(error);
      throw Error(error);
    }

    try {
      userId = await redis.get(forgotPasswordPrefix + token);
    } catch (error) {
      console.error("ERROR GETTING USER ID FROM REDIS INSTANCE");
      console.error(error);
      throw Error(error);
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

    const user = await ctx.dbConnection.getRepository(User).findOne(userId);

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
