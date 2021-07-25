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
    doc: "AWS Secret Access Key for Admin account (not root)",
    default: "********",
    env: "AWS_ADMIN_SECRET_ACCESS_KEY",
    format: String,
    secure: true,
  },
};

const sshOptions = {
  ssh: {
    username: {
      doc: "SSH User needed for remote host connection.",
      default: "********",
      env: "SSH_USER",
      format: String,
      secure: true,
    },
    host: {
      doc: "SSH Host to connect to.",
      default: "********",
      env: "SSH_HOST",
      format: String,
      secure: true,
    },
    privateKey: {
      doc: "Path to private key file",
      default: "********",
      env: "SSH_PRIVATE_KEY_PATH",
      format: String,
      secure: true,
    },
    sshPassword: {
      doc: "Password if used",
      default: "********",
      env: "SSH_PASS",
      format: String || undefined,
      secure: true,
    },
  },
};

const acmOptions = {
  awsCertificateTagKey: {
    default: "",
    doc: "Needed to tag our certificate upload. The tag is a key / value pair. This is the key portion.",
    env: "AWS_CERTIFICATE_TAG_KEY",
    format: String,
    secure: true,
  },
  awsCertificateTagValue: {
    default: "",
    doc: "Needed to tag our certificate upload. The tag is a key / value pair. This is the value portion.",
    env: "AWS_CERTIFICATE_TAG_VALUE",
    format: String,
    secure: true,
  },
};

const cloudFrontOptions = {
  cfArn: {
    default: "",
    doc: "The full ARN string for our CloudFront distribution.",
    env: "CLOUDFRONT_DISTRIBUTION",
    format: String,
    secure: true,
  },
};

const configBuilder = convict({ ...options, ...sshOptions, ...acmOptions, ...cloudFrontOptions });

configBuilder.validate({ allowed: "strict" });

export const config = configBuilder.getProperties();

export type ConfigOptions = typeof config;
