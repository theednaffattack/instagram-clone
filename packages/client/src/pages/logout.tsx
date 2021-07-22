import router from "next/router";
import React, { useEffect } from "react";
import { ErrorMessage } from "../components/error-message";
import { useLogoutMutation } from "../generated/graphql";

// type LogoutServerSideProps = Promise<{
//   props: {
//     initialApolloState: Record<string, unknown>;
//     revalidate: number;
//     response: any;
//   };
// }>;

const Logout = (): JSX.Element | void => {
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
  }
  return <div>LOUGOUT</div>;
};

// export async function getServerSideProps(ctx: MyContext): Promise<any> {
//   if (!ctx.apolloClient) ctx.apolloClient = initializeApollo();

//   try {
//     // await ctx.apolloClient.resetStore();
//     await ctx.apolloClient.cache.reset();
//   } catch (error) {
//     console.error("APOLLO RESET STORE", error);
//     throw Error("Error resetting Apollo cache.");
//   }

//   try {
//     await ctx.apolloClient.mutate<LogoutMutation>({
//       mutation: LogoutDocument,
//     });

//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   } catch (error) {
//     console.error("APOLLO MUTATE ERROR", error);
//     throw Error("Error logging out.");
//   }

//   // return { props: {} };
//   // return {
//   //   props: {
//   //     initialApolloState: {}, //apolloClient.cache.extract()
//   //     revalidate: 1,
//   //     response,
//   //   },
//   // };
// }

export default Logout;
