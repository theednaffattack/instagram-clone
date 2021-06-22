import { useEffect } from "react";
import { ErrorMessage } from "../components/error-message";
import { useLogoutMutation } from "../generated/graphql";

const Logout = (): any => {
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
    // eslint-disable-next-line no-console
    console.log("LOGOUT DATA", data);
    return null;
  }
  return null;
};

// Logout.getInitialProps = async (ctx: MyContext) => {
//   if (!ctx.apolloClient) ctx.apolloClient = initializeApollo();

//   console.log("VIEW APOLLO CLIENT", ctx.apolloClient);

//   try {
//     // await ctx.apolloClient.resetStore();
//     await ctx.apolloClient.cache.reset();
//   } catch (error) {
//     console.warn("APOLLO RESET STORE", error);
//   }
//   try {
//     await ctx.apolloClient.mutate({ mutation: LogoutDocument });
//   } catch (error) {
//     console.warn("APOLLO MUTATE ERROR", error);
//   }

//   redirect(ctx, "/login");

//   // return {};

//   return {
//     props: {
//       initialApolloState: {} //apolloClient.cache.extract()
//     },
//     revalidate: 1
//   };
// };

export default Logout;

// from: https://github.com/vercel/next.js/blob/canary/examples/with-apollo/pages/index.js
// export async function getStaticProps() {
//   const apolloClient = initializeApollo()

//   await apolloClient.query({
//     query: ALL_POSTS_QUERY,
//     variables: allPostsQueryVars,
//   })

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//     revalidate: 1,
//   }
// }
