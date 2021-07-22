import { sign } from "jsonwebtoken";
import type { ServerConfigProps } from "./config.build-config";
import type { User } from "./entity.user";

interface CreateTokenProps {
  config: ServerConfigProps;
  user: User;
  expiresIn?: string;
}

export function createAccessToken({ config, user, expiresIn = "15m" }: CreateTokenProps) {
  let token;
  try {
    token = sign({ userId: user.id }, config.accessTokenSecret, {
      expiresIn,
    });
  } catch (error) {
    console.error("ERROR CREATING ACCESS TOKEN");
    console.error(error);
    throw new Error(error);
  }
  return token;
}

export function createRefreshToken({ config, user, expiresIn = "7d" }: CreateTokenProps) {
  return sign({ userId: user.id, tokenVersion: user.tokenVersion }, config.refreshTokenSecret, {
    expiresIn,
  });
}
