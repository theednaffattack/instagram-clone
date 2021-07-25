"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const acm_1 = __importDefault(require("aws-sdk/clients/acm"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./config");
const get_acm_cert_info_for_domain_1 = require("./get-acm-cert-info-for-domain");
const util_logger_1 = require("./util.logger");
const credentials = {
    accessKeyId: config_1.config.accessKeyId,
    secretAccessKey: config_1.config.secretAccessKey,
};
const clientManager = new acm_1.default({
    apiVersion: "2015-12-08",
    credentials,
    region: "us-east-1",
});
let current;
let expired;
let matching;
async function updateExistingCertificates() {
    try {
        const info = await get_acm_cert_info_for_domain_1.getAcmCertInfoForDomain("*.eddienaff.dev");
        current = info.current;
        expired = info.expired;
        matching = info.matching;
    }
    catch (error) {
        util_logger_1.logger.error(error, "Error retrieving existing certificates");
        throw new Error(error);
    }
    const filenames = [`cert.pem`, "privkey.pem", "fullchain.pem"];
    // Make sure our certificates exist locally
    await Promise.all(filenames.map(async (filename) => {
        try {
            await fs_1.default.promises.access(filename);
        }
        catch (error) {
            util_logger_1.logger.error(error, `File does not exist: ${__dirname}/donwloaded/${filename}`);
            throw Error(`File does not exist: ${__dirname}/donwloaded/${filename}`);
        }
        // Useless return, I think
        return filename;
    }));
    const fileCache = [];
    // Grab our files asynchronously
    const files = await Promise.all(filenames.map(async (filename) => {
        try {
            const theFile = await fs_1.default.promises.readFile(`${__dirname}/donwloaded/${filename}`);
            fileCache.push(theFile);
            return theFile;
        }
        catch (error) {
            util_logger_1.logger.error(error, `Error reding file: ${filename}`);
            throw Error(`Error reding file: ${filename}`);
        }
    }));
    util_logger_1.logger.info({ files, fileCache }, "Check after readFile");
    // Hide importing the cert until we figure out fs stuff.
    // // If we've gotten this far the files shouold exist.
    // clientManager.importCertificate(
    //   {
    //     Certificate: fs.readFileSync(path.resolve(__dirname, `./downloaded/cert.pem`)),
    //     // Because we're listing thie ARN it should replace the existing certificate.
    //     CertificateArn: config.cfArn,
    //     PrivateKey: fs.readFileSync(path.resolve(__dirname, `./downloaded/privkey.pem`)),
    //     CertificateChain: fs.readFileSync(path.resolve(__dirname, `./downloaded/fullchain.pem`)),
    //     Tags: [{ Key: config.awsCertificateTagKey, Value: config.awsCertificateTagValue }],
    //   },
    //   importCertCallback
    // );
}
updateExistingCertificates().then((data) => {
    util_logger_1.logger.info({ data }, "Let's see the data");
});
function importCertCallback(error, data) {
    if (error) {
        util_logger_1.logger.error(error, "VIEW ACM IMPORT CERT ERROR");
    }
    if (data && data.CertificateArn) {
        util_logger_1.logger.info(data, "CERTIFICATE SUCCESSFULLY RE-UPLOADED");
    }
    util_logger_1.logger.info(data, "LET'S SEE THE DATA");
}
