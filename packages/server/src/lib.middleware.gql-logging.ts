import type { NextFunction, Request, Response } from "express";
import { logger } from "./lib.logger";

export async function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime();

  res.on("finish", () => {
    if (req.body && req.body.operationName) {
      const elapsedTime = process.hrtime(startHrTime);
      const elapsedTimeInMs = elapsedTime[0] * 1000 + elapsedTime[1] / 1e6;

      logger.info({
        type: "timing",
        name: req.body.operationName,
        ms: `${elapsedTimeInMs} ms`,
      });
    }
  });

  next();
}
