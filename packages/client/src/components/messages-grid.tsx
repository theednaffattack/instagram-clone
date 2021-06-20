import { Center, Flex, Grid, IconButton, Stack, Text } from "@chakra-ui/core";
import { Form } from "formik";
import React, { ReactChild, ReactChildren } from "react";
import { useDropzone } from "react-dropzone";
import { UploadComponent } from "./upload-component";
import { AddFileIcon } from "./add-file-icon";
import { InputField } from "./forms.input-field";
import { MessagesByThreadId } from "./messages-by-thread-id";
import { Thumb } from "./thumb";

type MessagesGridProps = {
  children: ReactChild | ReactChildren | null;
  // dataMessages: GetMessagesByThreadIdQuery | undefined;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  isSubmitting: boolean;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  threadId?: string;
  values: {
    message: string;
    images: File[] | undefined;
    invitees: string[];
    threadId: string;
    sentTo: string;
  };
};

export function MessagesGrid({
  children,
  // dataMessages,
  handleSubmit,
  setFieldValue,
  threadId,
  values
}: MessagesGridProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    noClick: true,
    onDrop: (acceptedFiles) => {
      console.log("ACCEPTED DROP FILES", acceptedFiles);

      // setImageFiles(acceptedFiles);
      setFieldValue("images", acceptedFiles);
    }
  });

  return (
    <Grid
      gridTemplateColumns={{
        sm: "1fr",
        md: "1fr",
        lg: "250px 1fr",
        xl: "250px 1fr"
      }}
      w="100%"
      height="100%"
      {...getRootProps({ className: "dropzone" })}
    >
      {children}

      <Grid gridTemplateRows="1fr 60px">
        <Stack>
          {threadId ? <MessagesByThreadId threadId={threadId} /> : null}
          <Text>{values?.images?.[0]?.name}</Text>
        </Stack>
        {threadId ? (
          <Flex
            pb={5}
            borderTop="1pz solid #eee"
            bg="rgb(255,255,255)"
            flexDirection="column"
            position="fixed"
            bottom={0}
            w="100%"
          >
            <Flex>
              {values?.images?.map((image) => (
                <Thumb key={image.name + image.lastModified} file={image} />
              ))}
            </Flex>
            <Form
              onSubmit={handleSubmit}
              style={{ height: "100%", width: "100%", display: "flex" }}
            >
              <>
                {/* <input type="text" id="message2" name="message2" placeholder="ghost"  style={{border: "2px dashed crimson", width: "100%"}} /> */}
                <InputField
                  isRequired={true}
                  name="message"
                  label=""
                  placeholder="Say somethin'..."
                  // onKeyDown={(evt)=>onKeyDown(evt, handleSubmit)}
                />
              </>

              <IconButton
                p={0}
                colorScheme="transparent"
                type="button"
                // onClick={()=>console.log("NO DRAFT FEAR THIS YEAR")}
                // onClick={handleSubmit}
                // colorScheme="blue"
                aria-label="Search database"
                icon={<AddFileIcon boxSize={10} color="crimson" />}
              />
              <UploadComponent
                getInputProps={getInputProps}
                isDragActive={isDragActive}
                setFieldValue={setFieldValue}
              />
            </Form>
            {/* <MessageInput
                  invitees={invitees ?? []}
                  threadId={threadId ?? ""}
                  handleSubmit={handleSubmit}
                /> */}
          </Flex>
        ) : (
          <Center>
            <Text>Select a Thread to get started</Text>
          </Center>
        )}
      </Grid>
    </Grid>
  );
}
