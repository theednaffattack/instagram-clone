import { CloudFront } from "aws-sdk";
import { CookieOptions } from "express";
import internalIp from "internal-ip";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "./entity.user";
import { LoginResponse } from "./type.login-response";
import { MyContext } from "./typings";

const expireAlso = Math.floor(new Date().getTime() / 1000) + 60 * 60 * 1; // Current Time in UTC + time in seconds, (60 * 60 * 1 = 1 hour)

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginResponse)
  // @UseMiddleware(Logger)
  async login(
    @Arg("username", () => String) username: string,
    @Arg("password", () => String, { description: "Your user password" }) password: string,
    @Ctx() ctx: MyContext
  ): Promise<LoginResponse> {
    // Setup a fake user until we hook up the database.
    const user = new User();

    user.firstName = "test";
    user.lastName = "test";
    user.id = "testID";
    user.password = password;
    user.confirmed = true;
    user.id = "123456789";

    console.log("VIEW ARGS", { user, username });
    // const user = await User.findOne({ where: { username } });
    // if we can't find a user return an obscure result (null) to prevent fishing
    if (!user) {
      return {
        errors: [{ field: "username", message: "Error logging in. Please try again." }],
      };
    }

    // const valid = await bcrypt.compare(password, user.password);
    const valid = user.password === password;

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
      // return null;
    }

    if (process.env.CF_PUBLIC_KEY && process.env.CF_PRIVATE_KEY) {
      const homeIp = internalIp.v4.sync();
      const options: CookieOptions = {
        domain: homeIp,
        httpOnly: true,
        // expires: expireAlso,
        maxAge: expireAlso,
        path: "/",
      };

      const cloudFrontPublicKey = process.env.CF_PUBLIC_KEY;
      const cloudFrontPrivateKey = process.env.CF_PRIVATE_KEY;

      const cloudFront = new CloudFront.Signer(cloudFrontPublicKey, cloudFrontPrivateKey);

      // const expireTime = Math.round(new Date().getTime() / 1000) + 3600;

      const policy = JSON.stringify({
        Statement: [
          {
            Resource: `http*://${process.env.CF_DOMAIN}/*`, // http* => http and https
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

      // Set Cookies after successful verification
      cloudFront.getSignedCookie(
        {
          policy,
        },
        (err, cfPolicy) => {
          console.log("CALLBACK", { err, cfPolicy });
          if (err) {
            console.error("ERROR GETTING THE COOKIE SIGNED", err);
          } else {
            console.log("WHY NO COOKIE???", ctx.res.cookie("test", "testValue", options));

            // ctx.cfCookie = returnedCookie;
            ctx.res.cookie("CloudFront-Policy", cfPolicy["CloudFront-Policy"], options);
            ctx.res.cookie("CloudFront-Key-Pair-Id", cfPolicy["CloudFront-Key-Pair-Id"], options);
            ctx.res.cookie("CloudFront-Signature", cfPolicy["CloudFront-Signature"], options);
          }
        }
      );

      // ctx.cfCookie = cfCookie;
    }

    // res.cookie("CloudFront-Key-Pair-Id", cookie["CloudFront-Key-Pair-Id"], {
    //     domain: ".your-domain.com",
    //     path: "/",
    //     httpOnly: true,
    // });

    // res.cookie("CloudFront-Policy", cookie["CloudFront-Policy"], {
    //     domain: ".your-domain.com",
    //     path: "/",
    //     httpOnly: true,
    // });

    // res.cookie("CloudFront-Signature", cookie["CloudFront-Signature"], {
    //     domain: ".your-domain.com",
    //     path: "/",
    //     httpOnly: true,
    // });

    // all is well return the user we found
    ctx.req.session!.userId = user.id;
    ctx.userId = user.id;
    return {
      user: user,
    };
  }
}
