import convict from "convict";
import { ipaddress, url } from "convict-format-with-validator";
import dotenv from "dotenv";
import internalIp from "internal-ip";
require("dotenv").config();

dotenv.config();

convict.addFormat(ipaddress);
convict.addFormat(url);

export interface ServerConfigSchema {
  admins: {
    doc: string;
    format: ArrayConstructor;
    nullable: boolean;
    default: any;
  };
  db: {
    connectionString: {
      default: string;
      doc: string;
      format: StringConstructor;
    };
    host: {
      default: string;
      doc: string;
      format: string;
    };
    name: {
      default: string;
      doc: string;
      format: StringConstructor;
    };
  };
  env: {
    default: string;
    doc: string;
    env: string;
    format: string[];
  };
  ip: {
    default: string;
    doc: string;
    env: string;
    format: string;
  };
  port: {
    arg: string;
    default: number;
    doc: string;
    env: string;
    format: string;
  };
}

// Define a schema
const configBuilder = convict({
  admins: {
    doc: "Users with write access, or null to grant full access without login.",
    format: Array,
    nullable: true,
    default: null,
  },
  client_uri: {
    default: "https://spc.eddienaff.dev",
    doc: "The URI of our client application.",
    format: "url",
  },
  db: {
    connectionString: { default: "sdffsdf", doc: "The database connection string", format: String },
    host: {
      default: "whatever",
      doc: "Database host name/IP",
      format: "*",
    },
    name: {
      default: "users",
      doc: "Database name",
      format: String,
    },
    username: {
      default: "spc",
      doc: "Postgres username for database login.",
      format: String,
    },
    password: {
      default: "*******",
      doc: "Postgres password for database login.",
      format: String,
    },
  },
  env: {
    default: "development",
    doc: "The application environment.",
    env: "NODE_ENV",
    format: ["production", "development", "test"],
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
});

// Load environment dependent configuration
const env = configBuilder.get("env");

configBuilder.loadFile(`${__dirname}/secret.${env}-variables.json`);

const host = internalIp
  .v4()
  .then((data) => data)
  .catch((error) => {
    console.warn(error);
    return undefined;
  });

configBuilder.set("db.host", host);

// Perform validation
configBuilder.validate({ allowed: "strict" });

const config = configBuilder.getProperties();

export { config };

export type ServerConfigProps = typeof config;
