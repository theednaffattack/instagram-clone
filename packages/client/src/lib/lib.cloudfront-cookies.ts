import { CloudFront } from "aws-sdk";
import internalIp from "internal-ip";
import type { CookieOptions, Response } from "express";

export async function cloudFrontCookies(res: Response): Promise<void> {
  const homeIp = internalIp.v4.sync();
  const expireTime = Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24 * 1; // Current Time in UTC + time in seconds, (60 * 60 * 24 * 1 = 1 day)

  const options: CookieOptions = {
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : homeIp,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: addDays(2),
    path: "/",
  };

  const cloudFront = new CloudFront.Signer(
    process.env.CF_PUBLIC_KEY_ID,
    process.env.CF_PRIVATE_KEY
  );

  const policy = {
    Statement: [
      {
        Resource: `http*://${process.env.CF_CDN_DOMAIN}/images/*`, // http* => http and https
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
          res.cookie(
            "CloudFront-Policy",
            cfPolicy["CloudFront-Policy"],
            options
          );
          res.cookie(
            "CloudFront-Key-Pair-Id",
            cfPolicy["CloudFront-Key-Pair-Id"],
            options
          );
          res.cookie(
            "CloudFront-Signature",
            cfPolicy["CloudFront-Signature"],
            options
          );
        }
      }
    );
  } catch (error) {
    console.error("ERROR GETTING SIGNED COOKIE");
    console.error(error);
    throw Error(error);
  }
}

function addDays(days: number) {
  const result = new Date();
  const date = result.getTime() / 1000 + 60 * 60 * 24 * 1;
  result.setDate(date + days);
  return result;
}
