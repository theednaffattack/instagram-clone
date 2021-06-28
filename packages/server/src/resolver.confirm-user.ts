import { Arg, Resolver, Mutation, Ctx } from "type-graphql";
import { getConnection } from "typeorm";
import { configBuildAndValidate } from "./config.build-config";
import { returnRedisInstance } from "./config.redis";

import { confirmUserPrefix } from "./constants";
import { User } from "./entity.user";
import { MyContext } from "./typings";

@Resolver()
export class ConfirmUser {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string, @Ctx() ctx: MyContext): Promise<boolean> {
    let userId;

    let redis;
    try {
      redis = await returnRedisInstance();
    } catch (error) {
      console.error("ERROR GETTING REDIS INSTANCE - CREATE CONFIRMATION EMAIL");
      console.error(error);
      throw Error(error);
    }

    try {
      userId = await redis.get(confirmUserPrefix + token);
    } catch (error) {
      console.warn("USER CONFIRMATION", error);
    }

    if (!userId) {
      return false;
    }

    let config;

    try {
      config = await configBuildAndValidate();
    } catch (error) {
      console.error("ERROR GETTING CONFIG - CONFIRM USER");
      console.error(error);
      throw Error(error);
    }

    // Update the user to be confirmed and remove the token from redis
    try {
      await getConnection(config.env).getRepository(User).update({ id: userId }, { confirmed: true });
    } catch (error) {
      throw Error(`User confirmation error:\n${error}`);
    }

    try {
      await redis.del(confirmUserPrefix + token);
    } catch (error) {
      throw Error(`User token deletion error:\n${error}`);
    }

    // all is well return the user we found

    // ctx.req.session!.userId = userId;
    // console.log("VIEW CONFIRM USER RESPONSE", { userId, ctx: ctx.req.session });
    return true;
  }
}
