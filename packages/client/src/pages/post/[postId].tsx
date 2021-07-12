import { NextPage } from "next";
import { Router } from "next/router";
import React from "react";
import { PostPublicCard } from "../../components/post.public-card";
import { MeQuery, useGetGlobalPostByIdQuery } from "../../generated/graphql";

type PostByIdProps = {
  router?: Router;
  me: MeQuery;
};

const PostById: NextPage<PostByIdProps> = ({ router }) => {
  const { data, error, loading } = useGetGlobalPostByIdQuery({
    variables: {
      getpostinput: {
        postId: router?.query.postId as string,
      },
    },
  });
  if (error) return <div>{JSON.stringify(error)}</div>;
  if (loading) return <div>loading...</div>;
  return <PostPublicCard cardProps={data.getGlobalPostById} />;
};

// PostById.getInitialProps = async (ctx: MyContext) => {
//   if (!ctx.apolloClient) ctx.apolloClient = initializeApollo();

//   let meResponse;
//   try {
//     meResponse = await ctx.apolloClient.mutate({
//       mutation: MeDocument,
//     });
//   } catch (error) {
//     console.warn("ME ERROR - POST ROUTE", error);
//   }

//   return {
//     me: meResponse?.data ? meResponse?.data : {},
//   };
// };

export default PostById;
