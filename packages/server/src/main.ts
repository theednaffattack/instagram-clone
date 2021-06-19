import { v4 } from "internal-ip";
import { configBuildAndValidate } from "./config.build-config";
import { readFile } from "./lib.readFile";
import { server } from "./server";

// Try to catch any uncaught async errors.
process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node.js docs)
});

async function main() {
  let readyConfig;
  let config;
  try {
    const initialConfig = await configBuildAndValidate();
    config = initialConfig.getProperties();

    console.log("WHAT IS ENV", config.env);

    let host: string | undefined;
    if (config.env === "development") {
      console.log("WHY IS THIS EXECUTING", config.env === "development");

      try {
        host = v4.sync();
      } catch (error) {
        console.error("Error determining IP address.", error);
        host = undefined;
      }

      // // override default settings (load env file) to use development
      // // settings instead.
      // configBuilt.loadFile(`${__dirname}/secret.${env}-variables.json`);
      let configOverride: string | undefined;

      configOverride = await readFile(`${__dirname}/secret.development-variables.json`);

      if (configOverride) {
        // Override values set via .env file by manually loading, parsing,
        // and looping over it.
        for (const [key, value] of Object.entries(JSON.parse(configOverride))) {
          // If the value is not an object we don't need
          // traverse it.
          if (value && typeof value !== "object") {
            initialConfig.set(key, value);
          }
          // If the value IS AN OBJECT we break up it's
          // values and loop over it, setting our config values
          // in the loop
          if (value && typeof value === "object") {
            const what = value;
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
              initialConfig.set(`${key}.${nestedKey}`, nestedValue);
            }
          }
        }
      }

      // Set a few values that don't make as much
      // sense (naming-wise) for local dev.
      if (typeof host === "string") {
        initialConfig.set("domain", host);
        initialConfig.set("host", host);
        initialConfig.set("db.host", host);
        initialConfig.set("ip", host);
      }
    }
    initialConfig.validate();
    readyConfig = initialConfig.getProperties();
  } catch (configInitError) {
    console.error("SERVER CONFIG ERROR", configInitError);
    throw Error(`Config init error!\n${configInitError}`);
  }

  try {
    await server(readyConfig);
  } catch (serverInitErr) {
    console.error("SERVER INIT ERROR", serverInitErr);
  }
}

main().catch((mainErr) => console.log("ERROR EXECUTING MAIN FUNCTION", mainErr));
