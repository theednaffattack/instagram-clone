import { CookieOptions } from "express";
import internalIp from "internal-ip";
import { Ctx, Mutation, Resolver } from "type-graphql";
import { configBuildAndValidate } from "./config.build-config";
import { MyContext } from "./typings";

@Resolver()
export class Logout {
  @Mutation(() => Boolean)
  async logout(
    @Ctx()
    ctx: MyContext
  ): Promise<boolean> {
    const config = await configBuildAndValidate();

    return new Promise((resolve) => {
      const homeIp = internalIp.v4.sync();

      /**
       * Defines ExpressJS 'res.clearCookie' options for
       * CloudFront CDN cookies.
       */
      const clearCfCookieOptions: CookieOptions = {
        domain: config.env === "production" ? config.cookieDomain : homeIp,
        httpOnly: true,
        secure: config.env === "production",
        // expires: addDays(2),
        path: "/",
      };

      const clearAppCookieOptions = {
        domain: config.env === "production" ? config.domain : homeIp,
        httpOnly: true,
        secure: config.env === "production",
        path: "/",
      };

      // Clear app cookie
      ctx.res.clearCookie(config.cookieName, clearAppCookieOptions);

      // Clear the three cookies needed for CloudFront CDN.
      ctx.res.clearCookie("CloudFront-Key-Pair-Id", clearCfCookieOptions);
      ctx.res.clearCookie("CloudFront-Policy", clearCfCookieOptions);
      ctx.res.clearCookie("CloudFront-Signature", clearCfCookieOptions);
      return resolve(true);
    });
  }
}
