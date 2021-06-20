import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { NextPageContext } from "next";

export interface MyContext extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}
