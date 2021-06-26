import convict from "convict";
import { ipaddress, url } from "convict-format-with-validator";

convict.addFormat(ipaddress);
convict.addFormat(url);

export interface ServerConfigProps {
  allowedOrigins: string;
  client_uri: string;
  cookieName: string;
  domain: string;
  host: string;
  db: {
    connectionString: string;
    host: string;
    name: string;
    username: string;
    password: string;
    port: string;
  };
  env: string;
  apiEndpoint: string;
  ip: string;
  port: number;
  postmarkToken: string;
  secret: string;
}

// Define a schema
export const configBuildAndValidate = async function () {
  const configBuilder = convict({
    allowedOrigins: {
      doc: "Allowed list of CORS origins",
      default: "ic.eddienaff.dev",
      env: "ALLOWED_ORIGINS",
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
      s3Bucket: {
        default: "**********",
        doc: "Info for connecting to S3",
        env: "S3_BUCKET",
        format: "*",
        sensitive: true,
      },
    },
    client_uri: {
      default: "https://ic.eddienaff.dev",
      doc: "The URI of our client application.",
      format: "url",
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
    apiEndpoint: {
      default: "/api",
      doc: "The slash address of our GraphQl uri",
      env: "API_ENDPOINT",
      format: String,
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
    secret: {
      default: "",
      doc: "Secret used for session cookies and CSRF tokens",
      env: "SESSION_SECRET",
      format: "*",
      sensitive: true,
    },
  });

  // Perform validation
  return configBuilder.validate({ allowed: "strict" });
};

// const config = configBuilder.getProperties();

// export { config };
