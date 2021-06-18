import { config } from "./config.build-config";
import { sendEtherealEmail } from "./lib.send-nodemailer-email";
import { sendPostmarkEmail } from "./lib.send-postmark-email";

export async function sendEmail(toEmail: string, uri: string) {
  if (config.env === "production") {
    try {
      await sendPostmarkEmail(toEmail, uri);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  } else {
    try {
      await sendEtherealEmail(toEmail, uri);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }
}
