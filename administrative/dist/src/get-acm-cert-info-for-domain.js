"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAcmCertInfoForDomain = void 0;
const list_certificates_1 = require("./list-certificates");
const util_logger_1 = require("./util.logger");
const noResultsMessage = "No results, the Certificate List may be empty.";
async function getAcmCertInfoForDomain(domain) {
    var _a, _b;
    let certs;
    try {
        certs = await list_certificates_1.listAcmCertificates();
    }
    catch (error) {
        util_logger_1.logger.error(error, "Error obtaining list of certificates.");
        throw new Error(error);
    }
    // Currently we don't have certs that share a domain so this should be safe.
    // TODO: Add expiry check
    const matchingCerts = certs.filter(function (certDescription, index) {
        var _a;
        return ((_a = certDescription.Certificate) === null || _a === void 0 ? void 0 : _a.DomainName) === domain;
    });
    const current = [];
    const expired = [];
    if (matchingCerts.length) {
        for (const cert of matchingCerts) {
            if (cert &&
                typeof (cert === null || cert === void 0 ? void 0 : cert.Certificate) !== undefined &&
                ((_a = cert === null || cert === void 0 ? void 0 : cert.Certificate) === null || _a === void 0 ? void 0 : _a.NotAfter) &&
                ((_b = cert === null || cert === void 0 ? void 0 : cert.Certificate) === null || _b === void 0 ? void 0 : _b.NotAfter) < new Date()) {
                expired.push(cert);
            }
            else {
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
exports.getAcmCertInfoForDomain = getAcmCertInfoForDomain;
