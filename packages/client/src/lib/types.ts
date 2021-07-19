// Just a place to collect a bunch of shared types

import {
  ApolloClient,
  FetchResult,
  MutationFunctionOptions,
  NormalizedCacheObject,
} from "@apollo/client";
import { NextPageContext } from "next";
import { SignS3Mutation, SignS3MutationVariables } from "../generated/graphql";

export interface MyContext extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

export interface PreviewFile {
  blobUrl: string;
  lastModified: number;
  name: string;
  size: number;
  type: string;
}

export type SignS3Func = (
  options?: MutationFunctionOptions<SignS3Mutation, SignS3MutationVariables>
) => Promise<FetchResult<SignS3Mutation>>;
