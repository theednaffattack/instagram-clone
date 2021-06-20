import { ClientOptions, SubscriptionClient } from "subscriptions-transport-ws";

export class CustomSubscriptionClient extends SubscriptionClient {
  constructor(
    url: string,
    options?: ClientOptions,
    webSocketImpl?: any,
    webSocketProtocols?: string | string[]
  ) {
    // It needs to be forced lazy otherwise it will try to connect before the setting up the following workaround
    super(url, { ...options, lazy: true }, webSocketImpl, webSocketProtocols);

    // Workaround suggested for ISSUE 377 on subscriptions-transport-ws package
    // https://github.com/apollographql/subscriptions-transport-ws/issues/377#issuecomment-375567665
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.maxConnectTimeGenerator.setMin(this.maxConnectTimeGenerator.max);
    const { lazy = false } = options || {};
    if (!lazy) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.connect();
    }
  }
}
