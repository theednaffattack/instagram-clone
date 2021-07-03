import type { FetchResult, MutationFunctionOptions } from "@apollo/client";
import { Box, Button, IconButton, Text } from "@chakra-ui/react";
import { css } from "@linaria/core";
import axios from "axios";
import format from "date-fns/format";
import { FieldArray, Form, Formik } from "formik";
import { NextPage } from "next";
import { Router } from "next/router";
import React, { useRef, useState } from "react";
import { FaMinus } from "react-icons/fa";
import { InputField } from "../components/forms.input-field";
import { TextArea } from "../components/forms.textarea";
import { LayoutAuthenticated } from "../components/layout-authenticated";
import {
  MeQuery,
  PostConnection,
  SignS3Mutation,
  SignS3MutationVariables,
  useCreatePostMutation,
  useSignS3Mutation,
} from "../generated/graphql";

type CreatePostProps = {
  me: MeQuery;
  router?: Router;
};

type SignS3Func = (
  options?: MutationFunctionOptions<SignS3Mutation, SignS3MutationVariables>
) => Promise<FetchResult<SignS3Mutation>>;

interface PreviewFile {
  blobUrl: string;
  lastModified: number;
  name: string;
  size: number;
  type: string;
}

const inputStyles = css`
  display: none;
`;

const CreatePost: NextPage<CreatePostProps> = ({ router }) => {
  const fileInputRef = useRef<HTMLInputElement>();
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
    },
  });

  const [signFile] = useSignS3Mutation();

  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>(null);

  return (
    <LayoutAuthenticated>
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
              const [initialArray] = signS3Response;

              const imageUris = [];

              // Pull out just the Image uris we need to create the new Post.
              for (const responseObj of initialArray.data.signS3.signatures) {
                imageUris.push(
                  responseObj.url.replace(
                    "eddie-faux-gram.s3.amazonaws.com",
                    "d14jbys30omc9u.cloudfront.net"
                  )
                );
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
              router.push("/");
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

// CreatePost.getInitialProps = async (ctx: MyContext) => {
//   if (!ctx.apolloClient) ctx.apolloClient = initializeApollo();

//   let meResponse;
//   try {
//     meResponse = await ctx.apolloClient.mutate({
//       mutation: MeDocument,
//     });
//   } catch (error) {
//     console.warn("ERROR", error);
//   }

//   return {
//     me: meResponse?.data ? meResponse?.data : {},
//   };
// };

export default CreatePost;

function onFilesAdded(
  evt: React.ChangeEvent<HTMLInputElement>,
  setPreviewFile: React.Dispatch<React.SetStateAction<PreviewFile[]>>
): PreviewFile[] {
  evt.preventDefault();
  // if (this.state.disabled) return;

  let array;

  if (evt && evt.target) {
    array = fileListToArray(evt.target.files);
    const previewFiles = makeObjectUrls(array);
    setPreviewFile([...previewFiles]);
    return previewFiles;
  }

  // We are preferring files attached to curentTarget
  // simply because they didn't match once when handling
  // a totally different event. If the if statement above DOES NOT
  // execute the below if statement DOES execute.
  // I suppose now it should just be a switch or something.
  if (evt && evt.currentTarget && evt.currentTarget !== evt.target) {
    array = fileListToArray(evt.currentTarget.files);
    const previewFiles = makeObjectUrls(array);
    setPreviewFile([...previewFiles]);
    return previewFiles;
  }
}

function fileListToArray(list: FileList) {
  const array = [];
  for (let i = 0; i < list.length; i++) {
    array.push(list[i]);
  }
  return array;
}

function makeObjectUrls(someArray: File[]): PreviewFile[] {
  return someArray.map((file) => {
    const { lastModified, size, type } = file;

    return {
      blobUrl: URL.createObjectURL(file),
      lastModified,
      name: formatFilename(file.name),
      size,
      type,
    };
  });
}

function formatFilename(filename: string): string {
  // from: https://stackoverflow.com/questions/48495289/javascript-not-able-to-rename-file-before-upload
  const date = format(new Date(), "yyyyMMdd");
  const randomString = Math.random().toString(36).substring(2, 7);
  const fileExt = filename.split(".")[filename.split(".").length - 1];
  const cleanedFileameWithoutExt = filename
    .replace(`.${fileExt}`, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-");
  const newFileName = `${date}-${randomString}-${cleanedFileameWithoutExt}.${fileExt}`;
  return newFileName;
}

async function signAndUploadFiles(
  values: File[],
  signFile: SignS3Func,
  previewFiles: PreviewFile[]
) {
  return await Promise.all(
    previewFiles.map(async (imageFile) => {
      if (imageFile.type.includes("image")) {
        const preppedFile = {
          // arrayBuffer: imageFile.blobUrl,
          lastModified: imageFile.lastModified,
          name: formatFilename(imageFile.name),
          size: imageFile.size,
          type: imageFile.type,
        };

        let response: FetchResult<SignS3Mutation>;

        // Get file signatures from S3 (make the files okay to upload below)
        try {
          response = await signFile({
            variables: {
              files: [preppedFile],
            },
          });
        } catch (error) {
          console.warn("SIGN FILE ERROR", error);
        }

        // PUT ADDITIONAL UPLOAD VIA AXIOS TO STORAGE BUCKET
        // Utilize the signatures to upload the files to our storage bucket
        // via the axios 'PUT' method.

        const [{ signedRequest }] = response?.data?.signS3.signatures;
        if (!signedRequest) {
          throw Error("Unexpected error while uploading. Please try again");
        }
        if (signedRequest) {
          try {
            await uploadToS3(imageFile, signedRequest);
          } catch (error) {
            console.warn("UPLOAD ERROR", error);
          }
        }

        return response;
      }
    })
  );
}

async function uploadToS3(file: PreviewFile, signedRequest: string) {
  const options = {
    headers: {
      "Content-Type": file.type,
    },
  };

  // const newFileToUpload = makeAFileFromBlob(file.blobUrl, file.name, file.type);
  let newFileToUpload: File;
  try {
    newFileToUpload = await makeBlobUrlsFromReference({
      blobUri: file.blobUrl,
      filename: file.name,
      type: file.type,
    });
  } catch (error) {
    console.error(error);
    throw Error(error);
  }

  if (!newFileToUpload) {
    throw Error("Error uploading file to web storage.");
  }

  try {
    await axios.put(signedRequest, newFileToUpload, options);
  } catch (error) {
    console.error("ERROR SENDING FILES TO S3.", error);
    throw Error(error);
  }
}

async function makeBlobUrlsFromReference({
  blobUri,
  filename,
  type,
}: {
  blobUri: string;
  filename: string;
  type: string;
}) {
  return await fetch(blobUri)
    .then((r) => r.blob())
    .then((blobFile) => {
      return new File([blobFile], filename, {
        type: type,
      });
    });
}
