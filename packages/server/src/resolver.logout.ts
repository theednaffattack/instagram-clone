import { Resolver, Mutation, Ctx } from "type-graphql";
import { configBuildAndValidate } from "./config.build-config";
import { MyContext } from "./typings";

@Resolver()
export class Logout {
  @Mutation(() => Boolean)
  async logout(
    @Ctx()
    ctx: MyContext
  ): Promise<Boolean> {
    const config = await configBuildAndValidate();

    return new Promise((resolve) => {
      return ctx.req.session.destroy((err: Error) => {
        if (err) {
          console.error(err);
          return resolve(false);
        }

        const clearOptions = {
          domain: config.cookieDomain,
          httpOnly: true,
          path: "/",
          secure: config.env === "production",
          // maxAge: ctx.req.session.cookie.maxAge,
          // sameSite: "lax",
        };

        ctx.res.clearCookie(config.cookieName, clearOptions);
        ctx.res.clearCookie("CloudFront-Key-Pair-Id", clearOptions);
        ctx.res.clearCookie("CloudFront-Policy", clearOptions);
        ctx.res.clearCookie("CloudFront-Signature", clearOptions);
        return resolve(true);
      });
    });
  }
}
