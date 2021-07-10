/* eslint-disable no-console */
import * as postmark from "postmark";
import { ServerConfigProps } from "./config.build-config";

import { createWelcomeMessage } from "./lib.email.messages";

export async function sendPostmarkEmail(
  toEmail: string,
  uri: string,
  config: ServerConfigProps
): Promise<postmark.Models.MessageSendingResponse | undefined> {
  // Setup the Postmark client

  let mailSentResponse;

  const client = new postmark.ServerClient(config.postmarkToken);

  const welcomeMessage = createWelcomeMessage({ confirmationUri: uri, toEmail });

  // I believe we can provide a callback to client.sendEmail that uses the response
  // as well

  mailSentResponse = await client
    .sendEmail(welcomeMessage)
    .then((data) => {
      if (!data.Message || data.Message !== "OK") {
        throw Error("An error occurred sending confifmation message. Please delete record and try again.");
      }
      return data;
    })
    .catch((error) => error);

  if (config.env === "development") {
    console.log("CHECK TOTAL RESPONSE", { mailSentResponse });
    console.log("Message sent: %s", mailSentResponse.To);

    console.log("Confirmation URI: %s", welcomeMessage.HtmlBody);
  }
  return mailSentResponse;
}
