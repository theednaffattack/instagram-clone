import type { Config } from "node-ssh";
import { NodeSSH } from "node-ssh";
import isequal from "lodash.isequal";
import { config } from "./config";
import { logger } from "./util.logger";

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

async function run(sshConfig: Config) {
  const ssh = new NodeSSH();

  // First connect to the remote server
  try {
    await ssh.connect(sshConfig);
  } catch (error) {
    logger.error(error, "ERROR CONNECTING VIA SSH");
    throw new Error(error);
  }

  const remotePath: string = `/etc/letsencrypt/live/${config.ssh.host}/`;
  const localPath: string = `${__dirname}/downloaded/`;
  let remoteFile: Record<string, any> = {};

  // Once connected retrieve the remote files
  for (const [key, filename] of Object.entries(certNames)) {
    ssh.getFile(`${localPath}${filename}`, `${remotePath}/${filename}`).then(
      // success handler
      function () {
        remoteFile[key] = filename;
        logger.info({}, `Successful download: ${localPath}${filename}`);

        if (isequal(remoteFile, certNames)) {
          logger.info({}, "ALL DONE");
          ssh.dispose();
        }
      },
      // error handler
      function (error) {
        logger.error(error, `ERROR GETTING REMOTE FILE: ${filename}`);
      }
    );
  }
}

run({
  host: config.ssh.host,
  username: config.ssh.username,
  privateKey: config.ssh.privateKey,
});
