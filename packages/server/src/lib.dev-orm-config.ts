import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { ServerConfigProps } from "./config.build-config";

export const getConnectionOptionsCustom = (config: ServerConfigProps): PostgresConnectionOptions => {
  switch (config.env) {
    case "production":
      return {
        name: "development",
        type: "postgres",
        ssl: false,
        url: config.db.connectionString,
        logging: false,
        synchronize: false,
        entities: ["src/entity/**/*.ts"],
        migrations: ["src/migration/**/*.ts"],
        subscribers: ["src/subscriber/**/*.ts"],
        cli: {
          entitiesDir: "dist/entity",
          migrationsDir: "src/migration",
          subscribersDir: "src/subscriber",
        },
      };
    case "testing":
      return {
        name: config.env,
        type: "postgres",
        ssl: false,
        url: config.db.connectionString,
        logging: false,
        synchronize: true,
        entities: ["src/entity/**/*.ts"],
        migrations: ["src/migration/**/*.ts"],
        subscribers: ["src/subscriber/**/*.ts"],
        cli: {
          entitiesDir: "dist/entity",
          migrationsDir: "src/migration",
          subscribersDir: "src/subscriber",
        },
      };
    case "development":
      return {
        name: config.env,
        type: "postgres",
        ssl: false,
        url: config.db.connectionString,
        logging: false,
        synchronize: true,
        entities: ["src/entity/**/*.ts"],
        migrations: ["src/migration/**/*.ts"],
        subscribers: ["src/subscriber/**/*.ts"],
        cli: {
          entitiesDir: "dist/entity",
          migrationsDir: "src/migration",
          subscribersDir: "src/subscriber",
        },
      };
    default:
      // same as production
      return {
        name: config.env,
        type: "postgres",
        ssl: false,
        url: config.db.connectionString,
        logging: false,
        synchronize: false,
        entities: ["src/entity/**/*.ts"],
        migrations: ["src/migration/**/*.ts"],
        subscribers: ["src/subscriber/**/*.ts"],
        cli: {
          entitiesDir: "dist/entity",
          migrationsDir: "src/migration",
          subscribersDir: "src/subscriber",
        },
      };
  }
};
