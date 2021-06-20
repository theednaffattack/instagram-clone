import { Box, Button, Flex, Text } from "@chakra-ui/core";
import Axios from "axios";
import { Field, FieldArray, Form, Formik } from "formik";
import { NextPage } from "next";
import { Router } from "next/router";
import * as React from "react";
import { v4 } from "uuid";
import { InputField } from "../../components/forms.input-field";
import { TextArea } from "../../components/forms.textarea";
import { LayoutAuthenticated } from "../../components/layout-authenticated";
import { Thumb } from "../../components/thumb";
import {
  PostConnection,
  useCreatePostMutation,
  useSignS3Mutation
} from "../../generated/graphql";

export interface CameraStateType {
  cameraStatus: "cameraIsOpen" | "cameraIsClosed";
  cardImage: Blob | null;
}

export type CameraAction =
  | { type: "openCameraInit" }
  | { type: "closeCamera" }
  | { type: "clearCardImage" }
  | { type: "setCardImage"; payload: Blob };

const initialCameraState: CameraStateType = {
  cameraStatus: "cameraIsClosed",
  cardImage: null
};

function initCamera(theInitialCameraState: CameraStateType): CameraStateType {
  return {
    cameraStatus: theInitialCameraState.cameraStatus,
    cardImage: theInitialCameraState.cardImage
  };
}

function cameraReducer(
  state: CameraStateType,
  action: CameraAction
): CameraStateType {
  switch (action.type) {
    case "openCameraInit":
      return {
        cameraStatus: "cameraIsOpen",
        cardImage: null
      };

    case "closeCamera":
      return {
        cameraStatus: "cameraIsClosed",
        cardImage: null
      };

    case "clearCardImage":
      return {
        cameraStatus: state.cameraStatus,
        cardImage: null
      };

    case "setCardImage":
      return {
        cameraStatus: state.cameraStatus,
        cardImage: action.payload
      };

    default:
      return initialCameraState;
  }
}

type NewProps = {
  router: Router;
};

const New: NextPage<NewProps> = ({ router }) => {
  const [cameraState, cameraDispatch] = React.useReducer(
    cameraReducer,
    initialCameraState,
    initCamera
  );
  console.log({ cameraState, cameraDispatch });

  const [
    signS3
    // { data: dataSignS3, error: errorSignS3, loading: loadingSignS3 }
  ] = useSignS3Mutation();

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

        <Flex width="100%">
          <Formik
            initialValues={{ title: "", text: "", images: [] }}
            onSubmit={async (
              { images, text, title },
              { resetForm, setSubmitting }
            ) => {
              const getVariables = blobToFile(images[0], v4());

              const s3SignatureResponse = await signS3({
                variables: {
                  files: [
                    {
                      filename: getVariables.name,
                      filetype: getVariables.name
                    }
                  ]
                }
              });

              if (s3SignatureResponse && s3SignatureResponse.data) {
                // @TODO: LOOP OVER THE COLLECTION OF IMAGES
                await uploadToImageService({
                  file: images[0], // cardImage,
                  signedRequest:
                    s3SignatureResponse.data.signS3.signatures[0].signedRequest
                });

                resetForm();

                await createPost({
                  variables: {
                    data: {
                      images: [
                        s3SignatureResponse.data.signS3.signatures[0].url
                      ],
                      text,
                      title
                    }
                  }
                });
              }

              await createPost({
                variables: { data: { text, title, images } }
              });

              setSubmitting(false);
              resetForm({
                values: { text: "", title: "", images: [] }
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
                      xl: "block"
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
                                    right: 0
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
                                  console.log(
                                    "VIEW IMAGES",
                                    event.currentTarget.files
                                  );
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
};

export default New;

const blobToFile = (theBlob: Blob, filename: string) => {
  const theFile = new File([theBlob], filename, {
    type: "image/png",
    endings: "native"
  });

  return theFile;
};

const uploadToImageService = async ({ file, signedRequest }: any) => {
  const options = {
    headers: {
      "Content-Type": "image/png"
    }
  };
  const theFile = file;

  const uploadReturnInfo = {
    error: null,
    response: null
  };

  try {
    uploadReturnInfo.response = await Axios.put(
      signedRequest,
      theFile,
      options
    );
  } catch (error) {
    uploadReturnInfo.error = error;
    console.error({ error });
  }

  return uploadReturnInfo;
};
