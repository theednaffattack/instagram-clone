import { DescribeCertificateCommandOutput } from "@aws-sdk/client-acm";
import { listAcmCertificates } from "./list-certificates";
import { logger } from "./util.logger";

const noResultsMessage = "No results, the Certificate List may be empty.";

interface AcmInfoForDomainOutput {
  current: DescribeCertificateCommandOutput[];
  expired: DescribeCertificateCommandOutput[];
  matching: DescribeCertificateCommandOutput[];
}

export async function getAcmCertInfoForDomain(domain: string): Promise<AcmInfoForDomainOutput> {
  let certs: DescribeCertificateCommandOutput[];
  try {
    certs = await listAcmCertificates();
  } catch (error) {
    logger.error(error, "Error obtaining list of certificates.");
    throw new Error(error);
  }

  // Currently we don't have certs that share a domain so this should be safe.
  // TODO: Add expiry check

  const matchingCerts = certs.filter(function (certDescription, index) {
    return certDescription.Certificate?.DomainName === domain;
  });

  const current = [];
  const expired: DescribeCertificateCommandOutput[] = [];
  if (matchingCerts.length) {
    for (const cert of matchingCerts) {
      if (
        cert &&
        typeof cert?.Certificate !== undefined &&
        cert?.Certificate?.NotAfter &&
        cert?.Certificate?.NotAfter < new Date()
      ) {
        expired.push(cert);
      } else {
        current.push(cert);
      }
    }
  }
  // If there are no matching certificates throw an error.
  if (!matchingCerts.length) {
    throw new Error(noResultsMessage);
  }

  return { current, expired, matching: matchingCerts };
}
