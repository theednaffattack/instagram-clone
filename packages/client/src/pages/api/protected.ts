// This is an example of to protect an API route
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import type { Session } from "next-auth";
import { logger } from "../../lib/lib.logger";

export default async function protectedRoute(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  let session: Session;
  try {
    session = await getSession({ req });
  } catch (error) {
    logger.error("ERROR RETRIEVING SESSION");
    logger.error(error);
  }

  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    });
  } else {
    res.send({
      error: "You must be sign in to view the protected content on this page.",
    });
  }
}
