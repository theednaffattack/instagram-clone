import { AWSError } from "aws-sdk";
import ACM from "aws-sdk/clients/acm";
import { CredentialsOptions } from "aws-sdk/lib/credentials";
import fs from "fs";
import path from "path";
import { config } from "./config";
import { getAcmCertInfoForDomain } from "./get-acm-cert-info-for-domain";
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

let current;
let expired;
let matching;

async function updateExistingCertificates() {
  try {
    const info = await getAcmCertInfoForDomain("*.eddienaff.dev");
    current = info.current;
    expired = info.expired;
    matching = info.matching;
  } catch (error) {
    logger.error(error, "Error retrieving existing certificates");
    throw new Error(error);
  }

  const filenames = [`cert.pem`, "privkey.pem", "fullchain.pem"];
  // Make sure our certificates exist locally
  await Promise.all(
    filenames.map(async (filename) => {
      const filepath = path.join(__dirname, "downloaded", filename);
      try {
        await fs.promises.access(filepath);
      } catch (error) {
        logger.trace(error, "The hell is going on?");
        logger.error(error, `File does not exist: ${filepath}`);
        throw Error(`File does not exist:  ${filepath}`);
      }

      // Useless return, I think
      return filename;
    })
  );

  const fileCache: any[] = [];
  const fileKeeper: Record<string, any> = {};
  // Grab our files asynchronously
  const files = await Promise.all(
    filenames.map(async (filename) => {
      try {
        const filepath = path.join(__dirname, "/downloaded", filename);
        let theFile;
        try {
          theFile = await fs.promises.readFile(filepath, { encoding: "utf8" });
          // logger.info(theFile, "WHAT IS THIS???");
        } catch (error) {
          logger.trace(error, "Noooooo");
          logger.error(error, `Error reading file: ${filename}`);
          throw Error(error);
        }
        fileKeeper[filename] = theFile;
        return theFile;
      } catch (error) {
        logger.error(error, `Error reding file: ${filename}`);
        throw Error(error);
      }
    })
  );

  // if (fileKeeper["cert.pem"] && fileKeeper["chain.pem"] && fileKeeper["fullchain.pem"] && fileKeeper["privkey.pem"]) {
  // Hide importing the cert until we figure out fs stuff.
  // If we've gotten this far the files shouold exist.
  logger.info("called or not???");

  const response = clientManager.importCertificate(
    {
      Certificate: fileKeeper["cert.pem"],
      // Because we're listing thie ARN it should replace the existing certificate.
      CertificateArn: current[0].Certificate?.CertificateArn,
      PrivateKey: fileKeeper["privkey.pem"],
      CertificateChain: fileKeeper["fullchain.pem"],
      // Tags: [{ Key: config.awsCertificateTagKey, Value: config.awsCertificateTagValue }],
    },
    importCertCallback
  );
  logger.info(response, "WHY CAN'T I SEE RESPONSE");
  // }
  return response;
}

updateExistingCertificates()
  .then((data) => {
    logger.info({ data }, "Let's see the data");
  })
  .catch((error) => logger.error(error));

function importCertCallback(error: AWSError, data: ACM.ImportCertificateResponse): void {
  if (error) {
    logger.error(error, "VIEW ACM IMPORT CERT ERROR");
  }
  if (data && data.CertificateArn) {
    logger.info(data, "CERTIFICATE SUCCESSFULLY RE-UPLOADED");
  } else {
    logger.info(data, "LET'S SEE THE DATA");
  }
}
