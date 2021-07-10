import { getConnection } from "typeorm";
import type { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export async function productionMigrations(dbConnection: any, connectOptions: PostgresConnectionOptions) {
  let retries = 5;
  // Loop to run migrations. Keep
  // trying until
  while (retries) {
    try {
      const viewMigrations = await dbConnection?.runMigrations();
      if (viewMigrations) {
        console.log("MIGRATIONS HAVE BEEN RUN", viewMigrations);
      }
      break;
    } catch (error) {
      console.error("ERROR RUNNING TYPEORM MIGRATIONS", error);
    }

    retries -= 1;

    console.log(`\n\nRETRIES LEFT: ${retries}\n\n`);
    // wait 5 seconds
    setTimeout(() => console.log("MIGRATION WAIT TIMEOUT FIRING"), 5000);
  }
}
