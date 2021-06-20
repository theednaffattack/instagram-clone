import { Button, Flex, Text } from "@chakra-ui/core";
import { Field, FieldArray, Form, Formik } from "formik";
import Axios from "axios";
import React from "react";
import { v4 } from "uuid";

import {
  useSignS3Mutation,
  useCreatePostMutation,
  PostConnection
} from "../generated/graphql";
import { useRouter } from "next/router";
import { InputField } from "./forms.input-field";
import { TextArea } from "./forms.textarea";

interface CreatePostWithuploadProps {
  cardImage: Blob | null;
  // router: Router;
}

const blobToFile: any = (theBlob: Blob, filename: string) => {
  const theFile = new File([theBlob], filename, {
    type: "image/png",
    endings: "native"
  });

  return theFile;
};

const uploadToS3 = async ({ file, signedRequest }: any) => {
  const options = {
    headers: {
      "Content-Type": "image/png"
    }
  };
  const theFile = file;

  const s3ReturnInfo = await Axios.put(
    signedRequest,
    theFile,
    options
  ).catch((error) => console.error({ error }));

  return s3ReturnInfo;
};

export const CreatePostWithupload: React.FC<CreatePostWithuploadProps> = ({
  cardImage
  // router
}) => {
  const router = useRouter();
  const [
    signS3
    // { data: dataSignS3, error: errorSignS3, loading: loadingSignS3 }
  ] = useSignS3Mutation();

  const [
    createPost,
    { data: dataCreatePost, error: errorCreatePost }
  ] = useCreatePostMutation({
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
    <Flex
      border="1px #ccc solid"
      width={1}
      mt={3}
      p={3}
      flexDirection="column"
      style={{
        position: "relative"
      }}
    >
      <Text>{dataCreatePost ? "post created" : ""}</Text>
      <Text>{errorCreatePost ? "error creating post" : ""}</Text>

      <Formik
        initialValues={{ title: "", text: "", images: [] }}
        onSubmit={async (
          { images, text, title },
          { resetForm, setSubmitting }
        ) => {
          const getVariables = await blobToFile(cardImage, v4());

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
            await uploadToS3({
              file: cardImage,
              signedRequest:
                s3SignatureResponse.data.signS3.signatures[0].signedRequest
            });

            resetForm();

            await createPost({
              variables: {
                data: {
                  images: [s3SignatureResponse.data.signS3.signatures[0].url],
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

              <Button type="submit" colorScheme="teal" disabled={isSubmitting}>
                create post
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Flex>
  );
};
