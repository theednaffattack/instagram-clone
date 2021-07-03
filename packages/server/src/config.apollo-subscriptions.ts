import { SubscriptionServerOptions } from "apollo-server-core";
import { SessionMiddle } from "./config.session-middleware";

export function configGraphQLSubscriptions(sessionMiddleware: SessionMiddle): Partial<SubscriptionServerOptions> {
  return {
    path: "/subscriptions",
    onConnect: (_, ws: any) => {
      console.log("Client connected");
      return new Promise((res) =>
        sessionMiddleware(ws.upgradeReq, {} as any, () => {
          res({ req: ws.upgradeReq });
        })
      );
    },
    onDisconnect: (_webSocket, _context) => {
      console.log("Client disconnected");
    },
  };
}
