// Just a place to collect a bunch of shared types

import type {
  ApolloClient,
  FetchResult,
  MutationFunctionOptions,
  NormalizedCacheObject,
} from "@apollo/client";
import type { NextPage, NextPageContext } from "next";
import type { PropsWithChildren } from "react";
import type { LayoutAuthenticatedProps } from "../components/layout-authenticated";
import type {
  SignS3Mutation,
  SignS3MutationVariables,
} from "../generated/graphql";

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

export type MyNextPage<P> = NextPage<P> &
  P & {
    layout: ({
      children,
    }: PropsWithChildren<LayoutAuthenticatedProps>) => JSX.Element;
  };
