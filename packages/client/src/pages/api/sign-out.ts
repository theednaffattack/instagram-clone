// api/sign-out
import { NextApiRequest, NextApiResponse } from "next";

import { logger } from "../../lib/lib.logger";

export default async function signOutHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  /* remove cookies from request header */
  res.setHeader("Set-Cookie", [
    `CloudFront-Signature=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    `CloudFront-Key-Pair-Id=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    `CloudFront-Policy=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    `icg=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
  ]);

  logger.info("REMOVING CUSTOM COOKIES AND CLOUDFRONT COOKIES");

  res.status(200);
  return res.send(true);
  // res.redirect("/feed");
  // res.writeHead(302, { Location: "/" });
  // res.end();
}
