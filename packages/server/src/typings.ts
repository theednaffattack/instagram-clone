import { ExpressContext } from "apollo-server-express";
import type { CloudFront } from "aws-sdk";
import type { NextFunction, Request, Response } from "express";
import type { Session, SessionData } from "express-session";
import type { GraphQLArgs, GraphQLResolveInfo } from "graphql";
import type { Connection } from "typeorm";
import { ServerConfigProps } from "./config.build-config";
// import DataLoader = require("dataloader");

// import { user } from "./zapatos/schema";

interface GraphQlInputs {
  args: GraphQLArgs;
  info: GraphQLResolveInfo;
}

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export type MyContext = {
  cfCookie: CloudFront.Signer.CustomPolicy | any;
  config: ServerConfigProps;
  connection: ExpressContext["connection"];
  connectionName: string;
  dbConnection: Connection;
  gqlOpts: GraphQlInputs;
  req: Request;
  res: Response;
  next: NextFunction;
  usersLoader: any;
  userId: string;
};
