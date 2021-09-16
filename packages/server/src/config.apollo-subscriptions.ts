import { SubscriptionServerOptions } from "apollo-server-core";
import { SessionMiddle } from "./config.session-middleware";

export function configGraphQLSubscriptions(): Partial<SubscriptionServerOptions> {
  return {
    path: "/subscriptions",
    onConnect: (_, ws: any) => {
      console.log("Client connected");
      return new Promise(
        (resolve) => resolve({ req: ws.upgradeReq })
        // sessionMiddleware(ws.upgradeReq, {} as any, () => {
        //   res({ req: ws.upgradeReq });
        // })
      );
    },
    onDisconnect: (_webSocket, _context) => {
      console.log("Client disconnected");
    },
  };
}
