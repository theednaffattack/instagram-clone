import convict from "convict";
import { ipaddress, url } from "convict-format-with-validator";
import { v4 } from "internal-ip";
import path from "path";
import { handleAsyncWithArgs } from "./lib.handle-async";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";
import { readFile } from "./lib.readFile";

convict.addFormat(ipaddress);
convict.addFormat(url);

export interface ServerConfigProps {
  accessTokenSecret: string;
  apiEndpoint: string;
  allowedOrigins: string;
  awsConfig: {
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
    cfCdnDomain: string;
    cfDomainForUri: string;
    cfPublicKeyId: string;
    cfPublicKey: string;
    cfPrivateKey: string;
    cfDomain: string;
    s3Bucket: string;
  };
  clientUri: string;
  cookieDomain: string;
  cookieName: string;
  domain: string;
  env: string;
  host: string;
  db: {
    connectionString: string;
    host: string;
    name: string;
    username: string;
    password: string;
    port: string;
  };
  ip: string;
  migration: boolean;
  port: number;
  postmarkToken: string;
  redis: {
    connectionString: string;
    host: string;
    interiorPort: string;
    exteriorPort: string;
  };
  refreshTokenSecret: string;
  secret: string;
}

const configBuilder = convict({
  accessTokenSecret: {
    doc: "Secret used to decode JWT",
    default: "*********",
    env: "ACCESS_TOKEN_SECRET",
    format: String,
  },
  allowedOrigins: {
    doc: "Allowed list of CORS origins",
    default: "ic.eddienaff.dev",
    env: "ALLOWED_ORIGINS",
    format: String,
  },
  apiEndpoint: {
    default: "/api",
    doc: "The slash address of our GraphQl uri",
    env: "API_ENDPOINT",
    format: String,
  },
  awsConfig: {
    awsAccessKeyId: {
      default: "**********",
      doc: "AWS Access Key ID used as sort of an identifier / user ID.",
      env: "AWS_ACCESS_KEY_ID",
      format: "*",
      sensitive: true,
    },
    awsSecretAccessKey: {
      default: "**********",
      doc: "AWS Secret key used to access various services. This project uses S3 and CloudFront.",
      env: "AWS_SECRET_KEY",
      format: "*",
      sensitive: true,
    },
    cfCdnDomain: {
      default: "iccdn.eddienaff.dev",
      doc: "Custom domain used for Cloudfront file URIs residing in S3 Buckets.",
      env: "CF_CDN_DOMAIN",
      format: "*",
      sensitive: true,
    },
    cfDomain: {
      default: "**********",
      doc: "Cloudfront domain used for cookie settings.",
      env: "CF_DOMAIN",
      format: "*",
      sensitive: true,
    },
    cfDomainForUri: {
      default: "**********",
      doc: "Cloudfront domain used for file URIs. (Like in AWS Resource(s))",
      env: "CF_DOMAIN_FOR_URI",
      format: "*",
      sensitive: true,
    },
    cfPublicKey: {
      default: "**********",
      doc: "Cloudfront Public Key for key group name 'ic-server-too",
      env: "CF_PUBLIC_KEY",
      format: "*",
      sensitive: true,
    },
    cfPublicKeyId: {
      default: "**********",
      doc: "Cloudfront Private Key for key group name 'ic-server-too'",
      env: "CF_PUBLIC_KEY_ID",
      format: "*",
      sensitive: true,
    },
    cfPrivateKey: {
      default: "**********",
      doc: "Cloudfront Private Key for key group name 'ic-server-too'",
      env: "CF_PRIVATE_KEY",
      format: "*",
      sensitive: true,
    },
    s3Bucket: {
      default: "**********",
      doc: "Info for connecting to S3",
      env: "S3_BUCKET",
      format: "*",
      sensitive: true,
    },
  },
  clientUri: {
    default: "https://ic.eddienaff.dev",
    doc: "The URI of our client application.",
    format: "url",
  },
  cookieDomain: {
    default: ".eddienaff.dev",
    doc: "The domain setting in our server cookie.",
    env: "COOKIE_DOMAIN",
    format: String,
  },
  cookieName: {
    default: "icg",
    doc: "Cookie name used for our sessions.",
    env: "COOKIE_NAME",
    format: String,
  },
  domain: {
    default: "ic.eddienaff.dev",
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
      default: "ic.eddienaff.dev",
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
      default: "ic_user",
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
    format: ["production", "local_production", "development", "test"],
  },
  ip: {
    default: "127.0.0.1",
    doc: "The IP address to bind our server to.",
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
  migration: {
    default: false,
    doc: "A dev setting to easily run migrations.",
    format: Boolean,
  },
  postmarkToken: {
    default: "",
    doc: "Secret token used to access the Postmark mailing API.",
    env: "POSTMARK_API_TOKEN",
    format: "*",
    sensitive: true,
  },
  redis: {
    connectionString: {
      default: "redis://:<REDIS_PASSWORD???>@dokku-redis-<DOKKU_REDIS_SERVICE_NAME>:6379",
      doc: "The redis instance connection string",
      env: "REDIS_URL",
      format: String,
    },
    host: {
      default: "dokku-redis-ic-redis",
      doc: "The name of the redis host used to create the connection.",
      env: "REDIS_HOST",
      format: String,
    },
    interiorPort: {
      default: "6379",
      doc: "The number of the redis port used to create the connection.",
      env: "REDIS_INTERIOR_PORT",
      format: Number,
    },
    exteriorPort: {
      default: "56379",
      doc: "The number of the redis port used to create the connection.",
      env: "REDIS_EXTERIOR_PORT",
      format: Number,
    },
  },
  refreshTokenSecret: {
    default: "",
    doc: "Secret used for JWT CSRF tokens",
    env: "REFRESH_TOKEN_SECRET",
    format: "*",
    sensitive: true,
  },
  secret: {
    default: "",
    doc: "Secret used for session cookies and CSRF tokens",
    env: "SESSION_SECRET",
    format: "*",
    sensitive: true,
  },
});

// Extract properties to a POJO
const config = configBuilder.getProperties();

// Define a schema
export const configBuildAndValidate = async function () {
  let host: string | undefined;
  let finalConfig;
  if (config.env === "development") {
    try {
      host = v4.sync();
    } catch (error) {
      console.error("Error determining IP address.", error);
      host = undefined;
    }

    // // override default settings (load env file) to use development
    // // settings instead.
    // configBuilt.loadFile(`${__dirname}/secret.${env}-variables.json`);
    const filePath = path.join(__dirname, "secret.development-variables.json");

    const [configOverride, error] = await handleAsyncWithArgs(readFile, [filePath]);
    if (error) {
      handleCatchBlockError(error);
    }

    if (configOverride) {
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
          for (const [nestedKey, nestedValue] of Object.entries(value)) {
            configBuilder.set(`${key}.${nestedKey}`, nestedValue);
          }
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

    finalConfig = configBuilder.getProperties();
  }

  // Perform validation
  configBuilder.validate({ allowed: "strict" });

  // We get final properties here. This is easier
  // if we ever need to stack exceptions that AREN'T
  // caused by the development environment variable.
  finalConfig = configBuilder.getProperties();

  return finalConfig;
};

// const config = configBuilder.getProperties();

// export { config };
