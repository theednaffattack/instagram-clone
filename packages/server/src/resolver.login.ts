import { CloudFront } from "aws-sdk";
import bcrypt from "bcryptjs";
import { CookieOptions } from "express";
import internalIp from "internal-ip";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { configBuildAndValidate, ServerConfigProps } from "./config.build-config";
import { User } from "./entity.user";
import { createAccessToken } from "./lib.authentication";
import { logger } from "./lib.logger";
import { addDays, addMinutes } from "./lib.utilities.manipulate-time";
import { sendRefreshToken } from "./lib.utilities.send-refresh-token";
import { LoginResponse } from "./type.login-response";
import { MyContext } from "./typings";

const expireTime = Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24 * 1; // Current Time in UTC + time in seconds, (60 * 60 * 24 * 1 = 1 day)

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginResponse)
  async login(
    @Arg("username", () => String) username: string,
    @Arg("password", () => String, { description: "Your user password" }) password: string,
    @Ctx() ctx: MyContext
  ): Promise<LoginResponse> {
    let config: ServerConfigProps;

    try {
      config = await configBuildAndValidate();
    } catch (error) {
      console.error(error);
      throw new Error("Error creating 'config' object.");
    }

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
        expires: addDays(2),
        path: "/",
      };

      const cloudFront = new CloudFront.Signer(config.awsConfig.cfPublicKeyId, config.awsConfig.cfPrivateKey);

      const policy = {
        Statement: [
          {
            Resource: `http*://${config.awsConfig.cfCdnDomain}/images/*`, // http* => http and https
            Condition: {
              DateLessThan: {
                "AWS:EpochTime": expireTime,
              },
            },
          },
        ],
      };

      const stringifiedPolicy = JSON.stringify(policy);

      try {
        // Set Cookies after successful verification
        cloudFront.getSignedCookie(
          {
            policy: stringifiedPolicy,
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
    } else {
      // NOTE: This should probably throw an Error
      console.error("ERROR OBTAINING CLOUDFRONT SIGNING INFORMATION");
      return {
        errors: [{ field: "password", message: "Error signing in." }],
      };
    }

    // all is well return the user we found

    ctx.userId = user.id;
    const fifteenMinutes = addMinutes(new Date(), 15);
    // const sevenDays = addDays(7);

    const tokenObj: LoginResponse = {
      // Note: Sigining the token with "ACCESS TOKEN secret"
      tokenData: {
        accessToken: createAccessToken({ config: ctx.config, user, expiresIn: "15m" }),
        expiresIn: fifteenMinutes,
        userId: user.id,
        version: user.tokenVersion,
      },
    };

    sendRefreshToken({ res: ctx.res, user, config });

    // Remember the ACCESS TOKEN is in the response.
    return tokenObj;
  }
}
