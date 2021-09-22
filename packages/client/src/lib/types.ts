// Just a place to collect a bunch of shared types

import type { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import type { CombinedError, Operation } from "@urql/core";
import type { NextComponentType, NextPage, NextPageContext } from "next";
import type { NextUrqlContext, WithUrqlProps } from "next-urql";
import type NextApp from "next/app";
import type { PropsWithChildren, ReactChild } from "react";
import type { UseMutationResponse } from "urql";
// import type { LayoutAuthenticatedProps } from "../components/layout-authenticated";
import { AppLayout } from "../components/layout.app";
import type {
  Exact,
  ImageSubInput,
  LoginMutation,
  SignS3Mutation,
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

// export type SignS3Func = (
//   options?: MutationFunctionOptions<SignS3Mutation, SignS3MutationVariables>
// ) => Promise<FetchResult<SignS3Mutation>>;

export type SignS3Func = UseMutationResponse<
  SignS3Mutation,
  Exact<{
    files: ImageSubInput | ImageSubInput[];
  }>
>[1];

export type MyNextPage<P> = NextPage<P> &
  P & {
    layout: ({ children }: PropsWithChildren<any>) => JSX.Element;
  };

export type WithUrqlAndLayout = NextComponentType<
  NextUrqlContext,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  WithUrqlProps
> & {
  layout?: typeof AppLayout;
};

export type Experiment = <C extends NextPage<any, any> | typeof NextApp>(
  AppOrPage: C
  // eslint-disable-next-line @typescript-eslint/ban-types
) => NextComponentType<NextUrqlContext, {}, WithUrqlProps> & {
  layout?: typeof AppLayout;
};

export interface AuthState {
  authState: LoginMutation["login"]["tokenData"];
}

export interface AuthExchangeArgs {
  authState: AuthState;
  operation: Operation<any, any>;
}

type SortaCombinedError = Omit<CombinedError, "networkError">;

interface MyNetworkError extends Error {
  result?: {
    errors: any[];
  };
}

export interface BetterCombinedError extends SortaCombinedError {
  networkError?: MyNetworkError;
}

export type RChildren = ReactChild | ReactChild[];

export type WrapperReturn =
  | string
  | number
  | ReactChild[]
  | ReactChild
  | JSX.Element
  | undefined;
