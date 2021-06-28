import { configBuildAndValidate } from "./config.build-config";
import { sendEtherealEmail } from "./lib.send-nodemailer-email";
import { sendPostmarkEmail } from "./lib.send-postmark-email";

export async function sendEmail(toEmail: string, uri: string) {
  let config;
  try {
    config = await configBuildAndValidate();
  } catch (configInitError) {
    console.error("SERVER CONFIG ERROR", configInitError);
    throw Error(`Config init error!\n${configInitError}`);
  }

  if (config.env === "production") {
    try {
      await sendPostmarkEmail(toEmail, uri, config);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  } else {
    try {
      await sendEtherealEmail(toEmail, uri, config);
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
  }
}
