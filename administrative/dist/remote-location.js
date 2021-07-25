"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_ssh_1 = require("node-ssh");
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const config_1 = require("./config");
const util_logger_1 = require("./util.logger");
// The values of this object match the filenames
// in the remote directory. We have to loop instead
// of grabbing the directory because they're all
// symlinks.
const certNames = {
    cert: "cert.pem",
    chain: "chain.pem",
    fullchain: "fullchain.pem",
    privKey: "privkey.pem",
};
async function run(sshConfig) {
    const ssh = new node_ssh_1.NodeSSH();
    // First connect to the remote server
    try {
        await ssh.connect(sshConfig);
    }
    catch (error) {
        util_logger_1.logger.error(error, "ERROR CONNECTING VIA SSH");
        throw new Error(error);
    }
    const remotePath = `/etc/letsencrypt/live/${config_1.config.ssh.host}/`;
    const localPath = `${__dirname}/downloaded/`;
    let remoteFile = {};
    // Once connected retrieve the remote files
    for (const [key, filename] of Object.entries(certNames)) {
        ssh.getFile(`${localPath}${filename}`, `${remotePath}/${filename}`).then(
        // success handler
        function () {
            remoteFile[key] = filename;
            util_logger_1.logger.info({}, `Successful download: ${localPath}${filename}`);
            if (lodash_isequal_1.default(remoteFile, certNames)) {
                util_logger_1.logger.info({}, "ALL DONE");
                ssh.dispose();
            }
        }, 
        // error handler
        function (error) {
            util_logger_1.logger.error(error, `ERROR GETTING REMOTE FILE: ${filename}`);
        });
    }
}
run({
    host: config_1.config.ssh.host,
    username: config_1.config.ssh.username,
    privateKey: config_1.config.ssh.privateKey,
});
