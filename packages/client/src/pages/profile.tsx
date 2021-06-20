import { Avatar, Button, Text } from "@chakra-ui/core";
import { NextPage } from "next";

import { Layout } from "../components/layout.basic";
import { MeDocument, useMeQuery } from "../generated/graphql";
import { initializeApollo } from "../lib/config.apollo-client";
import { MyContext } from "../lib/types";



const Profile:NextPage = () => {
  const { data } = useMeQuery();

  return (
    <Layout>
      <>
        <Avatar size="lg" name={data?.me?.username} />
        <Text fontSize="3xl">{data?.me?.username}</Text>
        <Button type="button" colorScheme="teal">
          jsut a button
        </Button>
      </>
    </Layout>
  );
}

Profile.getInitialProps = async (ctx: MyContext) =>{
  if (!ctx.apolloClient) ctx.apolloClient = initializeApollo();

  

  let meResponse;
  try {
    meResponse = await ctx.apolloClient.mutate({
      mutation: MeDocument
    });
  } catch (error) {
    console.warn("ERROR", error);
  }

  return {
    me: meResponse?.data ? meResponse?.data : {},
  };
  
}

export default Profile;
