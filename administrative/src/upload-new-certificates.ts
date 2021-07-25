import { AWSError } from "aws-sdk";
import ACM from "aws-sdk/clients/acm";
import { CredentialsOptions } from "aws-sdk/lib/credentials";
import fs from "fs";
import path from "path";
import { config } from "./config";
import { logger } from "./util.logger";

const credentials: CredentialsOptions = {
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
};

const clientManager = new ACM({
  apiVersion: "2015-12-08",
  credentials,
  region: "us-east-1",
});

clientManager.importCertificate(
  {
    Certificate: fs.readFileSync(path.resolve(__dirname, `./downloaded/cert.pem`)),
    PrivateKey: fs.readFileSync(path.resolve(__dirname, `./downloaded/privkey.pem`)),
    CertificateChain: fs.readFileSync(path.resolve(__dirname, `./downloaded/fullchain.pem`)),
    Tags: [{ Key: config.awsCertificateTagKey, Value: config.awsCertificateTagValue }],
  },
  importCertCallback
);

function importCertCallback(error: AWSError, data: ACM.ImportCertificateResponse): void {
  if (error) {
    logger.error(error, "VIEW ACM IMPORT CERT ERROR");
  }
  if (data && data.CertificateArn) {
    logger.info(data, "CERTIFICATE SUCCESSFULLY RE-UPLOADED");
  }
  logger.info(data, "LET'S SEE THE DATA");
}
