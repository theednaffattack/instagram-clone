import { LogoutDocument } from "../generated/graphql";
import { initializeApollo } from "../lib/config.apollo-client";
import { MyContext } from "../lib/types";
import redirect from "../lib/utilities.redirect";

const Logout = () => {
  return null;
};

Logout.getInitialProps = async (ctx: MyContext) => {
  if (!ctx.apolloClient) ctx.apolloClient = initializeApollo();

  console.log("VIEW APOLLO CLIENT", ctx.apolloClient);

  try {
    // await ctx.apolloClient.resetStore();
    await ctx.apolloClient.cache.reset();
  } catch (error) {
    console.warn("APOLLO RESET STORE", error);
  }
  try {
    await ctx.apolloClient.mutate({ mutation: LogoutDocument });
  } catch (error) {
    console.warn("APOLLO MUTATE ERROR", error);
  }

  redirect(ctx, "/login");

  // return {};

  return {
    props: {
      initialApolloState: {} //apolloClient.cache.extract()
    },
    revalidate: 1
  };
};

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
