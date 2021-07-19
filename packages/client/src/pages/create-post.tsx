import { NextPage } from "next";
import { useSession } from "next-auth/client";
import { Router } from "next/router";
import React from "react";
import AccessDenied from "../components/access-denied";
import { CreatePostForm } from "../components/create-post-form";
import { LayoutAuthenticated } from "../components/layout-authenticated";
import { MeQuery } from "../generated/graphql";
import { useHasMounted } from "../lib/lib.hooks.has-mounted";

type CreatePostProps = {
  me: MeQuery;
  router?: Router;
};

const CreatePost: NextPage<CreatePostProps> = ({ router }) => {
  const [session, loading] = useSession();
  const mountedStatus = useHasMounted();

  // When rendering client side don't display anything until loading is complete
  if (mountedStatus === "hasMounted" && loading) return null;

  // If no session exists, display access denied message

  if (mountedStatus === "hasMounted" && !session) {
    return (
      <LayoutAuthenticated router={router}>
        <AccessDenied />
      </LayoutAuthenticated>
    );
  }

  // Otherwise render the create post page
  return (
    <LayoutAuthenticated router={router}>
      <CreatePostForm />
    </LayoutAuthenticated>
  );
};

export default CreatePost;
