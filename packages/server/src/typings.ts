import { ExpressContext } from "apollo-server-express";
import type { CloudFront } from "aws-sdk";
import type { NextFunction, Response } from "express";
import type { GraphQLResolveInfo, GraphQLArgs } from "graphql";
import type { Connection } from "typeorm";
// import DataLoader = require("dataloader");

// import { user } from "./zapatos/schema";

interface GraphQlInputs {
  args: GraphQLArgs;
  info: GraphQLResolveInfo;
}

export interface MyContext {
  cfCookie: CloudFront.Signer.CustomPolicy | any;
  connection: ExpressContext["connection"];
  connectionName: string;
  dbConnection: Connection;
  gqlOpts: GraphQlInputs;
  req: any; // Request;
  res: Response;
  next: NextFunction;
  usersLoader: any;
  userId: string; // user.Selectable["id"];
}
