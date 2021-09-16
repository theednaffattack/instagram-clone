import { json, urlencoded } from "body-parser";
import express from "express";
import { v4 } from "internal-ip";
import next from "next";
import { logger } from "./lib/lib.logger";

const port = parseInt(process.env.PORT!, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Try to catch any uncaught async errors.
process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node.js docs)
});

nextApp
  .prepare()
  .then(() => {
    const server = express();

    // Try to catch any uncaught async errors.
    server.on("uncaughtException", (err) => {
      logger.error("There was an uncaught error", err);
      process.exit(1); //mandatory (as per the Node.js docs)
    });

    server.use(urlencoded({ extended: true }));
    server.use(json());
    server.use(function (req, res, next) {
      res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
      next();
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    // ↓↓↓ add route for post method
    server.post("*", (req, res) => {
      return handle(req, res);
    });
    // ↑↑↑ add route for post method

    server.listen(port, () => {
      if (!process.env.NODE_ENV) {
        throw new Error("NODE_ENV is undefined!");
      }
      if (process.env.NODE_ENV === "production") {
        logger.info(
          `> Ready at: ${process.env.NEXT_PUBLIC_PRODUCTION_BASE_URL}`
        );
      }
      if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
      ) {
        const ip = v4.sync();
        logger.info(`> Ready on LAN at:       http://${ip}:${port}`);
        logger.info(`> Ready on localhost at: http://localhost:${port}`);
      }
    });
  })
  .catch((err) => {
    logger.error(err);
  });
