import { CloudFront } from "aws-sdk";
import bcrypt from "bcryptjs";
import { CookieOptions } from "express";
import internalIp from "internal-ip";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

import { configBuildAndValidate } from "./config.build-config";
import { User } from "./entity.user";
import { LoginResponse } from "./type.login-response";
import { MyContext } from "./typings";

const expireAlso = Math.floor(new Date().getTime() / 1000) + 60 * 60 * 1; // Current Time in UTC + time in seconds, (60 * 60 * 1 = 1 hour)

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginResponse)
  async login(
    @Arg("username", () => String) username: string,
    @Arg("password", () => String, { description: "Your user password" }) password: string,
    @Ctx() ctx: MyContext
  ): Promise<LoginResponse> {
    const config = await configBuildAndValidate();

    let user;

    try {
      user = await ctx.dbConnection.getRepository(User).findOne({ where: { username } });
    } catch (error) {
      console.error(error);
      throw Error(error);
    }

    // if we can't find a user return an obscure result to prevent fishing
    if (!user) {
      return {
        errors: [{ field: "username", message: "Error logging in. Please try again." }],
      };
    }

    let valid;
    try {
      valid = await bcrypt.compare(password, user.password);
    } catch (error) {
      console.error("ERROR COMPARING ENCRYPTED PASSWORD");
      console.error(error);
      throw Error(error);
    }
    // const valid = user.password === password;

    // if the supplied password is invalid return early
    if (!valid) {
      return {
        errors: [{ field: "username", message: "Invalid credentials." }],
      };
    }

    // if the user has not confirmed via email
    if (!user.confirmed) {
      return {
        errors: [{ field: "username", message: "Please confirm your account." }],
      };
    }

    if (config.awsConfig.cfPublicKeyId && config.awsConfig.cfPrivateKey) {
      const homeIp = internalIp.v4.sync();
      const options: CookieOptions = {
        domain: config.env === "production" ? config.cookieDomain : homeIp,
        httpOnly: true,
        secure: config.env === "production",
        // expires: expireAlso,
        maxAge: expireAlso,
        path: "/",
      };

      const cloudFront = new CloudFront.Signer(config.awsConfig.cfPublicKeyId, config.awsConfig.cfPrivateKey);

      // const expireTime = Math.round(new Date().getTime() / 1000) + 3600;

      const policy = JSON.stringify({
        Statement: [
          {
            Resource: `http*://${config.awsConfig.cfDomain}/*`, // http* => http and https
            Condition: {
              DateLessThan: {
                "AWS:EpochTime": expireAlso,
              },
            },
          },
        ],
      });

      // adapted from: https://stackoverflow.com/a/48453457/9448010
      // const signedCookies = cloudFront.getSignedCookie({ policy });
      // type blah = keyof CloudFront.Signer.CustomPolicy;
      // const cookieKeys: blah[] = Object.keys(signedCookies);
      // for (const cookiePolicy of cookieKeys) {
      //     ctx.res.cookie(cookiePolicy, signedCookies[cookiePolicy], { domain: ".example.com" });
      // }

      try {
        // Set Cookies after successful verification
        cloudFront.getSignedCookie(
          {
            policy,
          },
          (err, cfPolicy) => {
            if (err) {
              console.error("ERROR GETTING THE CLOUDFRONT COOKIE SIGNED", err);
              throw err;
            } else {
              ctx.res.cookie("CloudFront-Policy", cfPolicy["CloudFront-Policy"], options);
              ctx.res.cookie("CloudFront-Key-Pair-Id", cfPolicy["CloudFront-Key-Pair-Id"], options);
              ctx.res.cookie("CloudFront-Signature", cfPolicy["CloudFront-Signature"], options);
            }
          }
        );
      } catch (error) {
        console.error("ERROR GETTING SIGNED COOKIE");
        console.error(error);
        throw Error(error);
      }

      // ctx.cfCookie = cfCookie;
    } else {
      // NOTE: This should probably throw an Error
      console.error("CAN'T FIND CF SIGNING INFORMATION");
    }

    // all is well return the user we found

    ctx.req.session.userId = user.id;
    ctx.req.session.save();
    ctx.userId = user.id;
    return {
      user: user,
    };
  }
}
