import convict, { Config } from "convict";
import { ipaddress, url } from "convict-format-with-validator";
import internalIp from "internal-ip";
import { ServerConfigProps } from "./config";

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

export async function buildConfig(): Promise<ServerConfigProps> {
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
        default: "127.0.0.1",
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

  let host: string | undefined;

  try {
    host = await internalIp.v4();
  } catch (error) {
    console.error("Error determining IP address.", error);
    host = undefined;
  }

  if (host !== undefined) {
    configBuilder.set("db.host", host);
  }

  // Perform validation
  configBuilder.validate({ allowed: "strict" });

  const config = configBuilder.getProperties();

  return config;
}
