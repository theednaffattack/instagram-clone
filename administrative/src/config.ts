import convict, { Config, Options } from "convict";
import { ipaddress, url } from "convict-format-with-validator";

convict.addFormat(ipaddress);
convict.addFormat(url);

const options = {
  accessKeyId: {
    doc: "AWS Access Key ID for Admin account (not root)",
    default: "*********",
    env: "AWS_ADMIN_ACCESS_KEY_ID",
    format: String,
    secure: true,
  },
  secretAccessKey: {
    doc: "",
    default: "********",
    env: "AWS_ADMIN_SECRET_ACCESS_KEY",
    format: String,
    secure: true,
  },
};

const configBuilder = convict(options);

configBuilder.validate({ allowed: "strict" });

export const config = configBuilder.getProperties();

export type ConfigOptions = typeof config;
