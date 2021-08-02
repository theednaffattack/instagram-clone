import React from "react";
import { CreatePostForm } from "../components/create-post-form";
import { LayoutAuthenticated } from "../components/layout-authenticated";
import { Protected } from "../components/protected";

function CreatePost(): JSX.Element {
  return <CreatePostForm />;
}

CreatePost.authentication = Protected;
CreatePost.layout = LayoutAuthenticated;

export default CreatePost;
