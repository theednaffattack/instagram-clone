import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import internalIp from "internal-ip";
import { ServerConfigProps } from "./config.build-config";

const homeIp = internalIp.v4.sync();

export function devOrmconfig(config: ServerConfigProps) {
  return {
    name: "default",
    type: "postgres",
    host: homeIp,
    port: process.env.PG_EXTERIOR_PORT ? parseInt(process.env.PG_EXTERIOR_PORT) : 5438,
    ssl: false,
    username: config.db.username,
    password: config.db.password,
    database: config.db.name,
    logging: true,
    synchronize: true,
    entities: ["src/entity/**/*.*"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  };
}
