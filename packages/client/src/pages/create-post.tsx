import { NextPage } from "next";
import { Router } from "next/router";
import React from "react";
import { CreatePostForm } from "../components/create-post-form";
import { LayoutAuthenticated } from "../components/layout-authenticated";
import { MeQuery } from "../generated/graphql";

type CreatePostProps = {
  me: MeQuery;
  router?: Router;
};

const CreatePost: NextPage<CreatePostProps> = ({ router }) => {
  // Otherwise render the create post page
  return (
    <LayoutAuthenticated router={router}>
      <CreatePostForm />
    </LayoutAuthenticated>
  );
};

export default CreatePost;
