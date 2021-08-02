import { FetchResult, MutationUpdaterFn } from "@apollo/client";
import { Box, Button, IconButton, Text } from "@chakra-ui/react";
import { css } from "@linaria/core";
import { FieldArray, Form, Formik } from "formik";
import router from "next/router";
import { useRef, useState } from "react";
import { FaMinus } from "react-icons/fa";
import {
  CreatePostMutation,
  PostConnection,
  SignS3Mutation,
  useCreatePostMutation,
  useSignS3Mutation,
} from "../generated/graphql";
import {
  signAndUploadFiles,
  onFilesAdded,
} from "../lib/lib.helper.create-post-form";
import { PreviewFile } from "../lib/types";
import { InputField } from "./forms.input-field";
import { TextArea } from "./forms.textarea";

const inputStyles = css`
  display: none;
`;

export function CreatePostForm(): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>();

  const [createPost, { error: errorCreatePost }] = useCreatePostMutation({
    update: updateGlobalPosts,
  });

  const [signFile] = useSignS3Mutation();

  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>(null);

  return (
    <Box>
      <Text fontSize="3xl">Create Post</Text>
      <Formik
        initialValues={{ title: "", text: "", images: [] }}
        onSubmit={async (argOne, actions) => {
          // First we'll send the files up to S3.
          // Then we'll pass the results to the database.
          let signS3Response: FetchResult<
            SignS3Mutation,
            Record<string, any>,
            Record<string, any>
          >[];
          try {
            signS3Response = await signAndUploadFiles(
              argOne.images,
              signFile,
              previewFiles
            );
          } catch (s3UploadError) {
            console.error(
              "Error uploading (or maybe signing for trust) to S3",
              s3UploadError
            );
          }

          // ======================================
          // BEG - IT'S RIGHT HERE, REDO THIS - BEG
          // ======================================
          // Create a new Post
          try {
            const [{ data }] = signS3Response;

            const imageUris = [];

            // Pull out just the Image uris we need to create the new Post.
            for (const responseObj of data.signS3.signatures) {
              const newUri = responseObj.url;
              imageUris.push(newUri);
            }

            await createPost({
              variables: {
                data: {
                  text: argOne.text,
                  title: argOne.title,
                  images: [...imageUris],
                },
              },
            });
          } catch (error) {
            console.error("Error creating Post");
            console.error(error);
            throw Error(error);
          }

          // ======================================
          // END - IT'S RIGHT HERE, REDO THIS - END
          // ======================================

          actions.setSubmitting(false);
          // clear the form
          actions.resetForm({
            values: { text: "", title: "", images: [] },
          });
          if (!errorCreatePost && router) {
            router.push("/feed");
          }
        }}
      >
        {({ handleSubmit, values, isSubmitting, setFieldValue }) => {
          const ImagesOfMine = [];
          for (const image of values.images) {
            ImagesOfMine.push(
              <div key={`${image.blobUrl}-for-of`}>
                <img src={image.blobUrl} />
              </div>
            );
          }
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
              <Button
                type="button"
                colorScheme="teal"
                onClick={(evt) => {
                  evt.preventDefault();
                  fileInputRef.current.click();
                }}
                // disabled={isSubmitting}
              >
                choose file
              </Button>

              <input
                className={inputStyles}
                ref={fileInputRef}
                id="images"
                name="images"
                type="file"
                multiple
                onChange={(event) => {
                  event.preventDefault();

                  const seeSomeFiles = onFilesAdded(event, setPreviewFiles);

                  setFieldValue("images", values.images.concat(seeSomeFiles));

                  return;
                }}
              />

              <FieldArray
                name="images"
                render={(arrayHelpers) => (
                  <div style={{ border: "2px limegreen dashed" }}>
                    {values.images && values.images.length ? (
                      values.images.map((image, index) => {
                        return (
                          <div
                            key={image.blobUrl}
                            style={{ border: "2px orange dashed" }}
                          >
                            <IconButton
                              colorScheme="teal"
                              aria-label="Remove picture"
                              size="lg"
                              type="button"
                              icon={<FaMinus />}
                              onClick={() => arrayHelpers.remove(index)}
                            />
                            <img
                              src={image.blobUrl}
                              style={{ border: "2px crimson dashed" }}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        {/* show this when user has removed all images from the list */}
                        Add an image
                      </button>
                    )}
                  </div>
                )}
              />

              <Button type="submit" colorScheme="teal" disabled={isSubmitting}>
                create post
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}

const updateGlobalPosts: MutationUpdaterFn<CreatePostMutation> = (
  cache,
  { data: postMutationData }
) => {
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
                id: postMutationData?.createPost.id,
              },
            },
            ...edges,
          ],
          __typename,
          pageInfo,
        };
      },
    },
  });
};
