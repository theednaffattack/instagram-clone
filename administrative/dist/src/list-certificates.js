"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAcmCertificates = void 0;
const client_acm_1 = require("@aws-sdk/client-acm");
const config_1 = require("./config");
const util_logger_1 = require("./util.logger");
const noResultsMessage = "No results, the Certificate List may be empty.";
async function listAcmCertificates() {
    // AWS credentials options
    const credentials = {
        accessKeyId: config_1.config.accessKeyId,
        secretAccessKey: config_1.config.secretAccessKey,
    };
    const clientConfig = {
        apiVersion: "2015-12-08",
        credentials,
        region: "us-east-1",
    };
    const listCommand = new client_acm_1.ListCertificatesCommand({});
    const client = new client_acm_1.ACMClient(clientConfig);
    let certList;
    try {
        certList = await client.send(listCommand);
    }
    catch (error) {
        util_logger_1.logger.error(error, "ERROR FETCHING CERTIFICATE LIST");
        throw new Error(error);
    }
    if (certList === null || certList === void 0 ? void 0 : certList.CertificateSummaryList) {
        try {
            return await Promise.all(certList.CertificateSummaryList.map(async ({ CertificateArn }) => {
                const describeCommand = new client_acm_1.DescribeCertificateCommand({
                    CertificateArn,
                });
                return await client.send(describeCommand);
            }));
        }
        catch (error) {
            util_logger_1.logger.error(error, "ERROR LOADING CERTIFICATE DESCRIPTION(S)");
            throw new Error(error);
        }
    }
    throw new Error(noResultsMessage);
}
exports.listAcmCertificates = listAcmCertificates;
listAcmCertificates()
    .then((data) => {
    var _a;
    util_logger_1.logger.info(data, "VIEW AWS ACM CERTIFICATES");
    const [first] = data;
    return (_a = first === null || first === void 0 ? void 0 : first.Certificate) === null || _a === void 0 ? void 0 : _a.CertificateArn;
})
    .catch((error) => util_logger_1.logger.error(error, "ERROR (ListCerts)!"))
    .finally(() => util_logger_1.logger.info("LIST CERTS FUNCTION COMPLETE"));
