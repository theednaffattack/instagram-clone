import type { NextFunction, Request, Response } from "express";
import { logger } from "./lib.logger";

export async function appLoggingMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const startHrTime = process.hrtime();
  res.on("finish", () => {
    if (req.path === "/graphql") {
      return;
    }
    logger.info("VIEW REQ PATH");
    logger.info({ reqPath: req.path });

    if (req.body && req.body.operationName) {
      const elapsedTime = process.hrtime(startHrTime);
      const elapsedTimeInMs = elapsedTime[0] * 1000 + elapsedTime[1] / 1e6;

      logger.info({
        type: "SEE ME",
        name: req.body.operationName,
        ms: `${elapsedTimeInMs} ms`,
      });
    }
  });

  next();
}
