import { Box, Button, Text } from "@chakra-ui/core";
import { Field, FieldArray, Form, Formik } from "formik";
import { NextPage } from "next";
import { Router } from "next/router";
import React from "react";

import { InputField } from "../components/forms.input-field";
import { TextArea } from "../components/forms.textarea";
import { LayoutAuthenticated } from "../components/layout-authenticated";
import {
  MeDocument,
  MeQuery,
  PostConnection,
  useCreatePostMutation
} from "../generated/graphql";
import { initializeApollo } from "../lib/config.apollo-client";
import { MyContext } from "../lib/types";

type CreatePostProps = {
  me: MeQuery;
  router?: Router;
};

const CreatePost: NextPage<CreatePostProps> = ({ router }) => {
  const [createPost, { error: errorCreatePost }] = useCreatePostMutation({
    update(cache, { data: postMutationData }) {
      // if there's no data don't screw around with the cache
      if (!postMutationData) return;

      cache.modify({
        fields: {
          getGlobalPostsRelay(existingPosts): PostConnection {
            const { edges, __typename, pageInfo } = existingPosts;

            return {
              edges: [
                {
                  __typename: "PostEdge",
                  cursor: new Date().toISOString(),
                  node: {
                    comments_count: 0,
                    likes_count: 0,
                    currently_liked: false,
                    likes: [],
                    created_at: new Date().toISOString(),
                    __typename: postMutationData?.createPost.__typename,
                    images: postMutationData?.createPost.images,
                    text: postMutationData?.createPost.text,
                    title: postMutationData?.createPost.title,
                    id: postMutationData?.createPost.id
                  }
                },
                ...edges
              ],
              __typename,
              pageInfo
            };
          }
        }
      });
    }
  });
  return (
    <LayoutAuthenticated>
      <Box>
        <Text fontSize="3xl">Create Post</Text>
        <Formik
          initialValues={{ title: "", text: "", images: [] }}
          onSubmit={async ({ text, title, images }, actions) => {
            await createPost({
              variables: { data: { text, title, images } }
            });

            actions.setSubmitting(false);
            actions.resetForm({
              values: { text: "", title: "", images: [] }
            });
            if (!errorCreatePost && router) {
              router.push("/");
            }
          }}
        >
          {({ handleSubmit, values, isSubmitting }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <InputField
                  isRequired={true}
                  label="title"
                  name="title"
                  placeholder="Title"
                />
                <TextArea
                  isRequired={true}
                  label="text"
                  name="text"
                  placeholder="Message"
                />

                <FieldArray
                  name="images"
                  render={(arrayHelpers) => (
                    <div>
                      {values.images && values.images.length > 0 ? (
                        values.images.map((_image, index) => (
                          <div key={index}>
                            <Field name={`images.${index}`} />
                            <button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)} // remove a image from the list
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => arrayHelpers.insert(index, "")} // insert an empty string at a position
                            >
                              +
                            </button>
                          </div>
                        ))
                      ) : (
                        <button
                          type="button"
                          onClick={() => arrayHelpers.push("")}
                        >
                          {/* show this when user has removed all images from the list */}
                          Add a image
                        </button>
                      )}
                    </div>
                  )}
                />

                <Button
                  type="submit"
                  colorScheme="teal"
                  disabled={isSubmitting}
                >
                  create post
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </LayoutAuthenticated>
  );
};

CreatePost.getInitialProps = async (ctx: MyContext) => {
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
    me: meResponse?.data ? meResponse?.data : {}
  };
};

export default CreatePost;
