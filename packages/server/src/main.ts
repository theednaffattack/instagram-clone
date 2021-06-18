import { config } from "./config.build-config";

import { server } from "./server";

export interface IIndexable<T = unknown> {
  [key: string]: T;
}
export interface AppServerConfigProps extends IIndexable {
  api: string;
  cookieDomain: string;
  cookieName: string;
  clientUri: string;
  domain: string;
  dbName: string;
  dbUrl: string;
  dbUser: string;
  dbPass: string;
  nodeEnv: string;
  origin: string;
  sessionSecret: string;
  virtualPort: string;
}

// Try to catch any uncaught async errors.
process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node.js docs)
});

async function main() {
  try {
    await server(config);
  } catch (serverInitErr) {
    console.error("SERVER INIT ERROR", serverInitErr);
  }

  //   const envKeys: EnvKeyProps = {
  //     api: "PRODUCTION_API_ORIGIN",
  //     clientUri: "PRODUCTION_CLIENT_URI",
  //     cookieDomain: "COOKIE_DOMAIN",
  //     cookieName: "COOKIE_NAME",
  //     domain: "DOMAINS",
  //     dbName: "POSTGRES_DBNAME",
  //     dbUrl: "DATABASE_URL",
  //     dbUser: "POSTGRES_USER",
  //     dbPass: "POSTGRES_PASS",
  //     nodeEnv: "NODE_ENV",
  //     origin: "PRODUCTION_CLIENT_ORIGIN",
  //     sessionSecret: "SESSION_SECRET",
  //     virtualPort: "VIRTUAL_PORT",
  //   };
  //   const config: AppServerConfigProps = {
  //     api: process.env.PRODUCTION_API_ORIGIN ?? "not defined",
  //     clientUri: process.env.PRODUCTION_CLIENT_URI ?? "not defined",
  //     cookieDomain: process.env.COOKIE_DOMAIN ?? "not defined",
  //     cookieName: process.env.COOKIE_NAME ?? "not defined",
  //     domain: process.env.DOMAINS ?? "not defined",
  //     dbName: process.env.POSTGRES_DBNAME ?? "not defined",
  //     dbUrl: process.env.DATABASE_URL ?? "not defined",
  //     dbUser: process.env.POSTGRES_USER ?? "not defined",
  //     dbPass: process.env.POSTGRES_PASS ?? "not defined",
  //     nodeEnv: process.env.NODE_ENV ?? "not defined",
  //     origin: process.env.PRODUCTION_CLIENT_ORIGIN ?? "not defined",
  //     sessionSecret: process.env.SESSION_SECRET ?? "not defined",
  //     virtualPort: process.env.VIRTUAL_PORT ?? "not defined",
  //   };
  //   const configEntries = Object.entries(config);
  //   const undefinedKeys = [];
  //   for (const entry of configEntries) {
  //     const [key, value] = entry;
  //     if (value === "not defined") {
  //       undefinedKeys.push(
  //         `Configuration key "${key}" is undefined. Please check the ${envKeys[key]} enviroment variable.`
  //       );
  //     }
  //   }
  //   if (undefinedKeys.length > 0) {
  //     throw new AggregateError(undefinedKeys);
  //   } else {
  //     console.log("MAIN FUNC STARTING");
  //     try {
  //       await server(config);
  //     } catch (serverInitErr) {
  //       console.error("SERVER INIT ERROR", serverInitErr);
  //     }
  //   }
}

main().catch((mainErr) => console.log("ERROR EXECUTING MAIN FUNCTION", mainErr));
