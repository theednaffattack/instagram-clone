"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const acm_1 = __importDefault(require("aws-sdk/clients/acm"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
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
clientManager.importCertificate({
    Certificate: fs_1.default.readFileSync(path_1.default.resolve(__dirname, `./downloaded/cert.pem`)),
    PrivateKey: fs_1.default.readFileSync(path_1.default.resolve(__dirname, `./downloaded/privkey.pem`)),
    CertificateChain: fs_1.default.readFileSync(path_1.default.resolve(__dirname, `./downloaded/fullchain.pem`)),
    Tags: [{ Key: config_1.config.awsCertificateTagKey, Value: config_1.config.awsCertificateTagValue }],
}, importCertCallback);
function importCertCallback(error, data) {
    if (error) {
        util_logger_1.logger.error(error, "VIEW ACM IMPORT CERT ERROR");
    }
    if (data && data.CertificateArn) {
        util_logger_1.logger.info(data, "CERTIFICATE SUCCESSFULLY RE-UPLOADED");
    }
    util_logger_1.logger.info(data, "LET'S SEE THE DATA");
}
