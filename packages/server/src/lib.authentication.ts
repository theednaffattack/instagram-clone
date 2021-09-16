import { sign } from "jsonwebtoken";
import type { ServerConfigProps } from "./config.build-config";
import type { User } from "./entity.user";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";

interface CreateTokenProps {
  config: ServerConfigProps;
  user: User;
  expiresIn?: string;
}

export function createAccessToken({ config, user, expiresIn }: CreateTokenProps) {
  let token;
  try {
    token = sign({ userId: user.id }, config.accessTokenSecret, {
      expiresIn,
    });
  } catch (error) {
    logger.error("ERROR CREATING ACCESS TOKEN");
    handleCatchBlockError(error);
  }
  return token;
}

export function createRefreshToken({ config, user, expiresIn = "7d" }: CreateTokenProps): string {
  return sign({ userId: user.id, tokenVersion: user.tokenVersion }, config.refreshTokenSecret, {
    expiresIn,
  });
}
