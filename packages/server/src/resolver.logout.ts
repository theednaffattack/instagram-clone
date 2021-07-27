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
      const clearOptions = {
        domain: config.cookieDomain,
        httpOnly: true,
        path: "/",
        secure: config.env === "production",
        // maxAge: ctx.req.session.cookie.maxAge,
        // sameSite: "lax",
      };

      // Clear app cookie
      ctx.res.clearCookie(config.cookieName, clearOptions);

      // Clear the three cookies needed for CloudFront CDN.
      ctx.res.clearCookie("CloudFront-Key-Pair-Id", clearOptions);
      ctx.res.clearCookie("CloudFront-Policy", clearOptions);
      ctx.res.clearCookie("CloudFront-Signature", clearOptions);
      return resolve(true);
    });
  }
}
