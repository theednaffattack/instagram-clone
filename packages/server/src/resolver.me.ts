import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "./entity.user";
import { isAuth } from "./middleware.is-auth";
import { MyContext } from "./typings";

@Resolver()
export class MeResolver {
  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    // The below if statement SHOULD be impossible due to the 'isAuth'
    // middleware.
    if (!ctx.userId) {
      return null;
    }

    let user;
    try {
      user = await ctx.dbConnection.getRepository(User).findOne(ctx.userId);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }

    if (user) {
      return user;
    } else {
      return null;
    }
  }
}
