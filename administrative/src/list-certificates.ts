import {
  ACMClient,
  ACMClientConfig,
  DescribeCertificateCommand,
  DescribeCertificateCommandOutput,
  ListCertificatesCommand,
  ListCertificatesCommandOutput,
} from "@aws-sdk/client-acm";
import { CredentialsOptions } from "aws-sdk/lib/credentials";
import { config } from "./config";
import { logger } from "./util.logger";

const noResultsMessage = "No results, the Certificate List may be empty.";

async function ListCerts(): Promise<
  | DescribeCertificateCommandOutput[]
  | "No results, the Certificate List may be empty."
> {
  // AWS credentials options
  const credentials: CredentialsOptions = {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  };

  const clientConfig: ACMClientConfig = {
    apiVersion: "2015-12-08",
    credentials,
    region: "us-east-1",
  };

  const listCommand = new ListCertificatesCommand({});

  const client = new ACMClient(clientConfig);

  let certList: ListCertificatesCommandOutput | undefined;

  try {
    certList = await client.send(listCommand);
  } catch (error) {
    logger.errro(error, "ERROR FETCHING CERTIFICATE LIST");
    throw new Error(error);
  }

  if (certList?.CertificateSummaryList) {
    try {
      return await Promise.all(
        certList.CertificateSummaryList.map(async ({ CertificateArn }) => {
          const describeCommand = new DescribeCertificateCommand({
            CertificateArn,
          });
          return await client.send(describeCommand);
        })
      );
    } catch (error) {
      logger.errro(error, "ERROR LOADING CERTIFICATE DESCRIPTION(S)");
      throw new Error(error);
    }
  }

  return noResultsMessage;
}

ListCerts()
  .then((data) =>
    logger.info(typeof data === "object" ? data : { data }, "VIEW DATA")
  )
  .catch((error) => logger.error(error, "ERROR (ListCerts)!"))
  .finally(() => logger.info("LIST CERTS FUNCTION COMPLETE"));
