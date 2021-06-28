import { configBuildAndValidate } from "./config.build-config";
import { server } from "./server";

// Try to catch any uncaught async errors.
process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node.js docs)
});

async function main() {
  let config;

  try {
    config = await configBuildAndValidate();
  } catch (configInitError) {
    console.error("SERVER CONFIG ERROR", configInitError);
    console.error(configInitError);
    throw Error(`Error initializing configuration object for the application server.\n${configInitError}`);
  }

  try {
    await server(config);
  } catch (serverInitErr) {
    console.error("SERVER INIT ERROR", serverInitErr);
  }
}

main().catch((mainErr) => console.log("ERROR EXECUTING MAIN FUNCTION", mainErr));
