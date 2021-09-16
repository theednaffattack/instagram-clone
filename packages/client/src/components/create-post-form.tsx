/* eslint-disable @typescript-eslint/no-unused-vars */
// import { FetchResult, MutationUpdaterFn } from "@apollo/client";
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
  onFilesAdded,
  signAndUploadFiles,
} from "../lib/lib.helper.create-post-form";
import { logger } from "../lib/lib.logger";
import { PreviewFile } from "../lib/types";
import { InputField } from "./forms.input-field";
import { TextArea } from "./forms.textarea";

const inputStyles = css`
  display: none;
`;

interface FormValues {
  title: string;
  text: string;
  images: PreviewFile[];
}

function CreatePostForm(): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [{ error: errorCreatePost }, createPost] = useCreatePostMutation();

  const [
    { data: dataSignFile, error: errorSignFile, fetching: fetchingSignFile },
    signFile,
  ] = useSignS3Mutation();

  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);

  const [beginS3Process, setBeginS3Process] =
    useState<"init" | "loading" | "completed">("init");

  const initialValues: FormValues = { title: "", text: "", images: [] };
  return (
    <Box>
      <Text fontSize="3xl">Create Post</Text>
      <Formik
        initialValues={initialValues}
        onSubmit={async ({ images, text, title }, actions) => {
          // First are there images?
          if (images && previewFiles) {
            // First we'll send the files up to S3.
            // Then we'll pass the results to the database.
            let signS3Response: (SignS3Mutation | undefined)[] | "init" =
              "init";
            try {
              signS3Response = await signAndUploadFiles({
                data: dataSignFile,
                error: errorSignFile,
                signFile,
                previewFiles,
              });

              if (!signS3Response) {
                throw new Error("No Response from S3 Signing.");
              }
            } catch (s3UploadError) {
              logger.error(
                "Error uploading (or maybe signing for trust) to S3"
              );
              if (s3UploadError instanceof Error) {
                logger.error(s3UploadError);
                throw new Error(s3UploadError.message);
              }
              if (typeof s3UploadError === "string") {
                logger.error(s3UploadError);
                throw new Error(s3UploadError);
              }
            }

            // ======================================
            // BEG - IT'S RIGHT HERE, REDO THIS - BEG
            // ======================================
            // Create a new Post
            const imageUris = [];
            if (signS3Response && typeof signS3Response !== "string") {
              try {
                for (const item of signS3Response) {
                  if (item) {
                    // Pull out just the Image uris we need to create the new Post.
                    for (const responseObj of item.signS3.signatures) {
                      const newUri = responseObj.url;
                      imageUris.push(newUri);
                    }
                  }
                }

                await createPost({
                  data: {
                    text: text,
                    title: title,
                    images: [...imageUris],
                  },
                });
              } catch (error) {
                logger.error("Error creating Post");
                if (error instanceof Error) {
                  logger.error(error);
                  throw Error(error.message);
                }
                if (typeof error === "string") {
                  logger.error({ error });
                  throw new Error(error);
                }
              }
            }
            // ======================================
            // END - IT'S RIGHT HERE, REDO THIS - END
            // ======================================
          }

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
                  fileInputRef?.current?.click();
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

// const updateGlobalPosts: MutationUpdaterFn<CreatePostMutation> = (
//   cache,
//   { data: postMutationData }
// ) => {
//   // if there's no data don't screw around with the cache
//   if (!postMutationData) return;

//   cache.modify({
//     fields: {
//       getGlobalPostsRelay(existingPosts): PostConnection {
//         const { edges, __typename, pageInfo } = existingPosts;

//         return {
//           edges: [
//             {
//               __typename: "PostEdge",
//               cursor: new Date().toISOString(),
//               node: {
//                 comments_count: 0,
//                 likes_count: 0,
//                 currently_liked: false,
//                 likes: [],
//                 created_at: new Date().toISOString(),
//                 __typename: postMutationData?.createPost.__typename,
//                 images: postMutationData?.createPost.images,
//                 text: postMutationData?.createPost.text,
//                 title: postMutationData?.createPost.title,
//                 id: postMutationData?.createPost.id,
//               },
//             },
//             ...edges,
//           ],
//           __typename,
//           pageInfo,
//         };
//       },
//     },
//   });
// };

export default CreatePostForm;
