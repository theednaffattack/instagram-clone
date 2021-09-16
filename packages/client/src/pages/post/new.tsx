import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Axios from "axios";
import { Field, FieldArray, Form, Formik } from "formik";
import { useRouter } from "next/router";
import * as React from "react";
import { v4 } from "uuid";
import { InputField } from "../../components/forms.input-field";
import { TextArea } from "../../components/forms.textarea";
import { LayoutAuthenticated } from "../../components/layout-authenticated";
import { Thumb } from "../../components/thumb";
import {
  useCreatePostMutation,
  useSignS3Mutation,
} from "../../generated/graphql";
import { handleCatchBlockError } from "../../lib/lib.handle-catch-block-error";
import { handleAsyncWithArgs } from "../../lib/lib.handle-async-client";

function New(): JSX.Element {
  const router = useRouter();

  const [
    ,
    // { data: dataSignS3, error: errorSignS3, loading: loadingSignS3 }
    signS3,
  ] = useSignS3Mutation();

  const [{ error: errorCreatePost }, createPost] = useCreatePostMutation();

  return (
    <LayoutAuthenticated>
      <Box>
        <Text fontSize="3xl">Create Post</Text>

        <Flex width="100%">
          <Formik
            initialValues={{ title: "", text: "", images: [] }}
            onSubmit={async (
              { images, text, title },
              { resetForm, setSubmitting }
            ) => {
              const getVariables = blobToFile(images[0], v4());

              const [s3SignatureResponse, s3SignError] =
                await handleAsyncWithArgs(signS3, [
                  {
                    files: [
                      {
                        lastModified: 0,
                        size: 0,
                        name: getVariables.name,
                        type: getVariables.name,
                      },
                    ],
                  },
                ]);

              if (s3SignError) {
                handleCatchBlockError(s3SignError);
              }

              // const s3SignatureResponse = await signS3({
              //   files: [
              //     {
              //       lastModified: 0,
              //       size: 0,
              //       name: getVariables.name,
              //       type: getVariables.name,
              //     },
              //   ],
              // });

              if (s3SignatureResponse && s3SignatureResponse.data) {
                // @TODO: LOOP OVER THE COLLECTION OF IMAGES

                const [, uploadError] = await handleAsyncWithArgs(
                  uploadToImageService,
                  [
                    {
                      file: images[0], // cardImage,
                      signedRequest:
                        s3SignatureResponse.data.signS3.signatures[0]
                          .signedRequest,
                    },
                  ]
                );

                if (uploadError) {
                  handleCatchBlockError(uploadError);
                }

                resetForm();

                const [, createPostError] = await handleAsyncWithArgs(
                  createPost,
                  [
                    {
                      data: {
                        images: [
                          s3SignatureResponse.data.signS3.signatures[0].url,
                        ],
                        text,
                        title,
                      },
                    },
                  ]
                );

                if (createPostError) {
                  handleCatchBlockError(createPostError);
                }
              }

              setSubmitting(false);
              resetForm({
                values: { text: "", title: "", images: [] },
              });
              if (!errorCreatePost && router) {
                router.push("/");
              }
            }}
          >
            {({ handleSubmit, values, isSubmitting, setFieldValue }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <Text
                    display={{
                      sm: "none",
                      md: "none",
                      lg: "block",
                      xl: "block",
                    }}
                  >
                    or upload a picture from your file system
                  </Text>
                  <FieldArray
                    name="images"
                    render={(arrayHelpers) => (
                      <Flex flexDirection="column">
                        {values.images && values.images.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => {
                              // values.images.forEach((_, removeIndex) => {
                              //   arrayHelpers.remove(index);
                              // });
                              setFieldValue("images", []);
                            }}
                          >
                            {" "}
                            clear all
                          </button>
                        ) : null}
                        <Flex>
                          {values.images && values.images.length > 0 ? (
                            values.images.map((image, index) => (
                              <div key={index} style={{ position: "relative" }}>
                                <Thumb key={index} file={image} />
                                <Field name={`images.${index}.name`} />
                                <div
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                    style={{ marginRight: "3px" }}
                                  >
                                    -
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <>
                              <input
                                id="images"
                                name="images"
                                type="file"
                                capture="images"
                                accept="image/*"
                                onChange={(event) => {
                                  if (event.currentTarget.files) {
                                    setFieldValue(
                                      "images",
                                      Array.from(event.currentTarget.files)
                                    );
                                  }
                                }}
                                className="form-control"
                                multiple
                              />
                            </>
                          )}
                        </Flex>
                      </Flex>
                    )}
                  />
                  {values.images && values.images.length > 0 ? (
                    <>
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
                        type="submit"
                        colorScheme="teal"
                        disabled={isSubmitting}
                      >
                        create post
                      </Button>{" "}
                    </>
                  ) : null}
                </Form>
              );
            }}
          </Formik>
        </Flex>
        <div style={{ height: "83px" }}></div>
      </Box>
    </LayoutAuthenticated>
  );
}

New.layout = LayoutAuthenticated;

export { New as default };

const blobToFile = (theBlob: Blob, filename: string) => {
  const theFile = new File([theBlob], filename, {
    type: "image/png",
    endings: "native",
  });

  return theFile;
};

const uploadToImageService = async ({ file, signedRequest }: any) => {
  const options = {
    headers: {
      "Content-Type": "image/png",
    },
  };
  const theFile = file;

  const [putInS3Response, putInS3Error] = await handleAsyncWithArgs(Axios.put, [
    signedRequest,
    theFile,
    options,
  ]);

  if (putInS3Error) {
    handleCatchBlockError(putInS3Error);
  }

  // try {
  //   uploadReturnInfo.response = await Axios.put(
  //     signedRequest,
  //     theFile,
  //     options
  //   );
  // } catch (error) {
  //   uploadReturnInfo.error = error;
  //   console.error({ error });
  // }

  return putInS3Response;
};

// {
//   update(cache, { data: postMutationData }) {
//     // if there's no data don't screw around with the cache
//     if (!postMutationData) return;

//     cache.modify({
//       fields: {
//         getGlobalPostsRelay(existingPosts): PostConnection {
//           const { edges, __typename, pageInfo } = existingPosts;

//           return {
//             edges: [
//               {
//                 __typename: "PostEdge",
//                 cursor: new Date().toISOString(),
//                 node: {
//                   comments_count: 0,
//                   likes_count: 0,
//                   currently_liked: false,
//                   likes: [],
//                   created_at: new Date().toISOString(),
//                   __typename: postMutationData?.createPost.__typename,
//                   images: postMutationData?.createPost.images,
//                   text: postMutationData?.createPost.text,
//                   title: postMutationData?.createPost.title,
//                   id: postMutationData?.createPost.id,
//                 },
//               },
//               ...edges,
//             ],
//             __typename,
//             pageInfo,
//           };
//         },
//       },
//     });
//   },
// }
