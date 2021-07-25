// api/sign-out
import { NextApiRequest, NextApiResponse } from "next";

import { getCsrfToken } from "next-auth/client";
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
    `next-auth.csrf-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
  ]);
  // eslint-disable-next-line no-console
  logger.info("REMOVING CUSTOM COOKIES AND CLOUDFRONT COOKIES");

  let csrfToken;
  try {
    csrfToken = await getCsrfToken({ req });
  } catch (error) {
    logger.error(error, "ERROR GETTING TOKEN");
  }
  logger.info("TOKEN?");
  logger.info(csrfToken);

  res.status(200);
  return res.send(true);
  // res.redirect("/feed");
  // res.writeHead(302, { Location: "/" });
  // res.end();
}
