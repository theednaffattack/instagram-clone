import convict from "convict";
import { ipaddress, url } from "convict-format-with-validator";
import { readFileSync } from "fs";
import { v4 } from "internal-ip";

convict.addFormat(ipaddress);
convict.addFormat(url);

// export async function buildConfig(): Promise<ServerConfigProps> {
// Define a schema
const configBuilder = convict({
  client_uri: {
    default: "https://spc.eddienaff.dev",
    doc: "The URI of our client application.",
    format: "url",
  },
  cookieName: {
    default: "mfg",
    doc: "Cookie name used for our sessions.",
    env: "COOKIE_NAME",
    format: String,
  },
  domain: {
    default: "spc.eddienaff.dev",
    doc: "The hostname to use for linking and documentation references.",
    env: "DOMAINS",
    format: String,
  },
  host: {
    default: "0.0.0.0",
    doc: "Hostname we bind the server to",
    env: "DOMAINS",
    format: String,
  },
  db: {
    connectionString: {
      default: "postgres://spc_system:R4TDP6g37Lzkh3Fc5U8zGvfZx7@localhost:5432/spotify_clone",
      doc: "The database connection string",
      env: "DATABASE_URL",
      format: String,
    },
    host: {
      default: "spc.eddienaff.dev",
      doc: "Database host name/IP",
      format: "*",
    },
    name: {
      default: "spotify_clone",
      doc: "Database name",
      env: "POSTGRES_DBNAME",
      format: String,
    },
    username: {
      default: "spc",
      doc: "Postgres username for database login.",
      env: "POSTGRES_USER",
      format: String,
    },
    password: {
      default: "*******",
      doc: "Postgres password for database login.",
      env: "POSTGRES_PASSWORD",
      format: String,
    },
    port: {
      default: "5432",
      doc: "Postgres connection port",
      env: "POSTGRES_PORT",
      format: Number,
    },
  },
  env: {
    default: "development",
    doc: "The application environment.",
    env: "NODE_ENV",
    format: ["production", "development", "test"],
  },
  apiEndpoint: {
    default: "/api",
    doc: "The slash address of our GraphQl uri",
    env: "API_ENDPOINT",
    format: String,
  },
  ip: {
    default: "127.0.0.1",
    doc: "The IP address to bind.",
    env: "IP_ADDRESS",
    format: "ipaddress",
  },
  port: {
    arg: "port",
    default: 8080,
    doc: "The port to bind.",
    env: "PORT",
    format: "port",
  },
  secret: {
    default: "",
    doc: "Secret used for session cookies and CSRF tokens",
    env: "SESSION_SECRET",
    format: "*",
    sensitive: true,
  },
});

// Load environment dependent configuration
const env = configBuilder.get("env");

// configBuilder.loadFile(`${__dirname}/secret.${env}-variables.json`);

let host: string | undefined;
if (env === "development") {
  try {
    host = v4.sync();
  } catch (error) {
    console.error("Error determining IP address.", error);
    host = undefined;
  }

  // // override default settings (load env file) to use development
  // // settings instead.
  // configBuilder.loadFile(`${__dirname}/secret.${env}-variables.json`);

  let configOverride;
  try {
    configOverride = readFileSync(`${__dirname}/secret.${env}-variables.json`, "utf-8");
  } catch (error) {
    console.error(`ERROR LOADING CONFIGURATION OVERRIDE FILE: ${__dirname}/secret.${env}-variables.json`, error);
    throw Error(error);
  }

  // Override values set via .env file by manually loading, parsing,
  // and looping over it.
  for (const [key, value] of Object.entries(JSON.parse(configOverride))) {
    // If the value is not an object we don't need
    // traverse it.
    if (value && typeof value !== "object") {
      configBuilder.set(key, value);
    }
    // If the value IS AN OBJECT we break up it's
    // values and loop over it, setting our config values
    // in the loop
    if (value && typeof value === "object") {
      const what = value;
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        configBuilder.set(`${key}.${nestedKey}`, nestedValue);
      }
    }
  }

  // Set a few values that don't make as much
  // sense (naming-wise) for local dev.
  if (typeof host === "string") {
    configBuilder.set("domain", host);
    configBuilder.set("host", host);
    configBuilder.set("db.host", host);
    configBuilder.set("ip", host);
  }
}

// Perform validation
configBuilder.validate({ allowed: "strict" });

const config = configBuilder.getProperties();

export { config };

export type ServerConfigProps = typeof config;
