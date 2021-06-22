import { Resolver, Mutation, Ctx } from "type-graphql";
import { MyContext } from "./typings";

@Resolver()
export class Logout {
  @Mutation(() => Boolean)
  async logout(
    @Ctx()
    ctx: MyContext
  ): Promise<Boolean> {
    return new Promise((resolve) => {
      return ctx.req.session!.destroy((err: Error) => {
        if (err) {
          console.error(err);
          return resolve(false);
        }

        ctx.res.clearCookie(process.env.COOKIE_NAME!);
        return resolve(true);
      });
    });
  }
}
