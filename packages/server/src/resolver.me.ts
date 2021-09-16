import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "./entity.user";
import { handleAsyncWithArgs } from "./lib.handle-async";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";
import { isAuth } from "./middleware.is-auth";
import { MyContext } from "./typings";

@Resolver()
export class MeResolver {
  @UseMiddleware(isAuth)
  @Query(() => String)
  async bye(@Ctx() ctx: MyContext): Promise<string> {
    logger.info(ctx.payload, "CHECK PAYLOAD");
    return `bye ${ctx.payload.userId}`;
  }

  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    // The below if statement SHOULD be impossible due to the 'isAuth'
    // middleware.
    if (!ctx.payload.userId) {
      return null;
    }

    const [user, userError] = await handleAsyncWithArgs(ctx.dbConnection.getRepository(User).findOne, [ctx.userId]);

    if (userError) {
      handleCatchBlockError(userError);
    }

    if (user) {
      return user;
    } else {
      return null;
    }
  }
}
