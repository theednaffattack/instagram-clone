import { Button, Flex, Text } from "@chakra-ui/react";
import Axios from "axios";
import { Field, FieldArray, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { v4 } from "uuid";
import { useCreatePostMutation, useSignS3Mutation } from "../generated/graphql";
import { InputField } from "./forms.input-field";
import { TextArea } from "./forms.textarea";

interface CreatePostWithuploadProps {
  cardImage: Blob | null;
  // router: Router;
}

const blobToFile: any = (theBlob: Blob, filename: string) => {
  const theFile = new File([theBlob], filename, {
    type: "image/png",
    endings: "native",
  });

  return theFile;
};

const uploadToS3 = async ({ file, signedRequest }: any) => {
  const options = {
    headers: {
      "Content-Type": "image/png",
    },
  };
  const theFile = file;

  const s3ReturnInfo = await Axios.put(signedRequest, theFile, options).catch(
    (error) => console.error({ error })
  );

  return s3ReturnInfo;
};

export const CreatePostWithupload: React.FC<CreatePostWithuploadProps> = ({
  cardImage,
  // router
}) => {
  const router = useRouter();
  const [
    ,
    signS3,
    // { data: dataSignS3, error: errorSignS3, loading: loadingSignS3 }
  ] = useSignS3Mutation();

  const [{ data: dataCreatePost, error: errorCreatePost }, createPost] =
    useCreatePostMutation();

  return (
    <Flex
      border="1px #ccc solid"
      width={1}
      mt={3}
      p={3}
      flexDirection="column"
      style={{
        position: "relative",
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
            files: [
              {
                lastModified: 0,
                size: 0,
                name: getVariables.name,
                type: getVariables.name,
              },
            ],
          });

          if (s3SignatureResponse && s3SignatureResponse.data) {
            await uploadToS3({
              file: cardImage,
              signedRequest:
                s3SignatureResponse.data.signS3.signatures[0].signedRequest,
            });

            resetForm();

            await createPost({
              data: {
                images: [s3SignatureResponse.data.signS3.signatures[0].url],
                text,
                title,
              },
            });
          } else {
            await createPost({
              data: { text, title, images },
            });
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
