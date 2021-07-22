import { json, urlencoded } from "body-parser";
import express from "express";
import { v4 } from "internal-ip";
import next from "next";

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Try to catch any uncaught async errors.
process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node.js docs)
});

nextApp.prepare().then(() => {
  const server = express();

  // Try to catch any uncaught async errors.
  server.on("uncaughtException", (err) => {
    console.error("There was an uncaught error", err);
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
    // if (err) throw err;
    const ip = v4.sync();
    // eslint-disable-next-line no-console
    console.log(`> Ready on LAN at: http://${ip}:${port}`);

    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`);
  });
});
