import { configBuildAndValidate } from "./config.build-config";
import { handleAsyncSimple, handleAsyncWithArgs } from "./lib.handle-async";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";
import { sendEtherealEmail } from "./lib.send-nodemailer-email";
import { sendPostmarkEmail } from "./lib.send-postmark-email";

export async function sendEmail(toEmail: string, uri: string): Promise<void> {
  const [config, configError] = await handleAsyncSimple(configBuildAndValidate);

  if (configError) {
    logger.error("SERVER CONFIG ERROR", configError);
    handleCatchBlockError(configError);
  }

  if (config.env === "production") {
    const [, sendPostmarkEmailError] = await handleAsyncWithArgs(sendPostmarkEmail, [toEmail, uri, config]);

    if (sendPostmarkEmailError) {
      handleCatchBlockError(sendPostmarkEmailError);
    }
  } else {
    const [, sendEtherealEmailError] = await handleAsyncWithArgs(sendEtherealEmail, [toEmail, uri, config]);
    if (sendEtherealEmailError) {
      handleCatchBlockError(sendEtherealEmailError);
    }
  }
}
