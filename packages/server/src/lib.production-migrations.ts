import { Connection } from "typeorm";
import { handleAsyncSimple } from "./lib.handle-async";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";

export async function productionMigrations(dbConnection: Connection): Promise<void> {
  let retries = 5;
  // Loop to run migrations. Keep
  // trying until
  while (retries) {
    const [viewMigrations, error] = await handleAsyncSimple(dbConnection?.runMigrations);
    if (error) {
      logger.error("ERROR RUNNING TYPEORM MIGRATIONS");
      handleCatchBlockError(error);
    }
    if (viewMigrations) {
      break;
    }

    retries -= 1;

    logger.info(`\n\nRETRIES LEFT: ${retries}\n\n`);
    // wait 5 seconds
    setTimeout(() => logger.info("MIGRATION WAIT TIMEOUT FIRING"), 5000);
  }
}
