import { useEffect } from "react";
import { ErrorMessage } from "../components/error-message";
import { LogoutDocument, useLogoutMutation } from "../generated/graphql";
import { initializeApollo } from "../lib/lib.apollo-client";
import { MyContext } from "../lib/types";
import { redirect } from "../lib/utilities.redirect";

type LogoutServerSideProps = Promise<{
  props: {
    initialApolloState: Record<string, unknown>;
    revalidate: number;
    response: any;
  };
}>;

const Logout = ({ router }): any => {
  const [logoutFunc, { data, error, loading }] = useLogoutMutation();
  useEffect(() => {
    logoutFunc();
  }, []);

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  if (data) {
    if (router) {
      router.push("/login");
    }
    return null;
  }

  return null;
};

export async function getServerSideProps(
  ctx: MyContext
): Promise<LogoutServerSideProps> {
  if (!ctx.apolloClient) ctx.apolloClient = initializeApollo();

  try {
    // await ctx.apolloClient.resetStore();
    await ctx.apolloClient.cache.reset();
  } catch (error) {
    console.error("APOLLO RESET STORE", error);
    throw Error("Error resetting Apollo cache.");
  }
  let response;
  try {
    response = await ctx.apolloClient.mutate({ mutation: LogoutDocument });
  } catch (error) {
    console.error("APOLLO MUTATE ERROR", error);
    throw Error("Error logging out.");
  }

  redirect(ctx, "/login");

  return {
    props: {
      initialApolloState: {}, //apolloClient.cache.extract()
      revalidate: 1,
      response,
    },
  };
}

export default Logout;
