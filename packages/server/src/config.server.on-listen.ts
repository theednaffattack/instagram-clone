import colors from "colors/safe";

import { ServerConfigProps } from "./config.build-config";
import { logger } from "./lib.logger";

interface ServerDetails {
  graphqlPath: string;
  subscriptionsPath: string;
  homeIp: string;
  port: number;
}

export function serverOnListen(config: ServerConfigProps, deets: ServerDetails) {
  console.log(`

${colors.bgYellow(colors.black("    server started    "))}

GraphQL Playground available at:
  ${colors.green("localhost")}: http://localhost:${config.port}${deets.graphqlPath}
        ${colors.green("LAN")}: http://${config.domain}:${config.port}${deets.graphqlPath}

WebSocket subscriptions available at:
${colors.green("websockets")}: ws://${deets.homeIp}:${deets.port}${deets.subscriptionsPath}
`);

  logger.info("TESTING CHANGE");
}
