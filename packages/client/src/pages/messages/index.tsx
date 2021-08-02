import { Avatar, Button, Flex, Grid, Stack, Text } from "@chakra-ui/react";
import { Formik } from "formik";
import { NextPage } from "next";
import type { NextRouter } from "next/router";
import React, { useState } from "react";
import { LayoutAuthenticated } from "../../components/layout-authenticated";
import { MessagesGrid } from "../../components/messages-grid";
import {
  GetMessagesByThreadIdDocument,
  GetMessagesByThreadIdQuery,
  useAddMessageToThreadMutation,
  useGetOnlyThreadsQuery,
  User,
} from "../../generated/graphql";

type MessagesProps = {
  isNOTLgScreen: boolean;
  router: NextRouter;
};

const Messages: NextPage<MessagesProps> = ({ isNOTLgScreen, router }) => {
  // const [imageFiles, setImageFiles] = useState<File[]>();

  const [invitees, setInvitees] =
    useState<
      ({
        __typename?: "User" | undefined;
      } & Pick<User, "id" | "username" | "profileImageUri">)[]
    >();
  const [threadId, setThreadId] = useState<string | undefined>(undefined);

  const [addMessage] = useAddMessageToThreadMutation();

  const { data: dataThreads } = useGetOnlyThreadsQuery({
    variables: {
      feedinput: {
        take: 6,
      },
    },
  });

  const initialFormValues = {
    message: "",
    images: [],
    invitees: [] as any[],
    threadId: "",
    sentTo: "",
  };

  return (
    <Formik
      initialValues={initialFormValues}
      onSubmit={async (values, { resetForm }) => {
        try {
          await addMessage({
            variables: {
              invitees: values.invitees.map((user) => user.id),
              message: values.message,
              threadId: values.threadId,
              sentTo: values.sentTo,
              images: values?.images?.map(({ name }) => name) ?? [],
            },
            update(cache, { data }) {
              try {
                const cacheMessagesByThread =
                  cache.readQuery<GetMessagesByThreadIdQuery>({
                    query: GetMessagesByThreadIdDocument,
                    variables: {
                      input: {
                        threadId: values.threadId,
                        take: 15,
                      },
                    },
                  });

                if (cacheMessagesByThread?.getMessagesByThreadId && data) {
                  const updatedCache: GetMessagesByThreadIdQuery = {
                    __typename: "Query",
                    getMessagesByThreadId: {
                      pageInfo:
                        cacheMessagesByThread.getMessagesByThreadId.pageInfo,
                      __typename: "MessageConnection",
                      edges: [
                        ...cacheMessagesByThread.getMessagesByThreadId.edges,
                        {
                          node: {
                            __typename: "Message",
                            id: data.addMessageToThread.message.id,
                            text: data.addMessageToThread.message.text,
                            created_at:
                              data.addMessageToThread.message.created_at,
                            sentBy: {
                              __typename: "User",
                              id: data.addMessageToThread.user.id,
                            },
                          },
                          __typename: "MessageEdge",
                        },
                      ],
                    },
                  };

                  cache.writeQuery<GetMessagesByThreadIdQuery>({
                    query: GetMessagesByThreadIdDocument,
                    data: updatedCache,
                    variables: {
                      input: {
                        threadId: values.threadId,
                        take: 15,
                      },
                    },
                  });
                }
              } catch (error) {
                console.warn("CACHE READ ERROR", error);
              }
            },
          });
          resetForm({
            values: {
              message: "",
              images: [],
              threadId: values.threadId,
              invitees: values.invitees,
              sentTo: values.sentTo,
            },
          });
        } catch (error) {
          console.warn("ADD MESSAGE SUBMIT ERROR", error);
        }
      }}
    >
      {({ handleSubmit, isSubmitting, setFieldValue, values }) => {
        return (
          <LayoutAuthenticated isNOTLgScreen={isNOTLgScreen} router={router}>
            <MessagesGrid
              // dataMessages={dataMessages}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              setFieldValue={setFieldValue}
              threadId={values.threadId}
              values={values}
            >
              <>
                <Grid
                  w="100%"
                  bg={{ sm: "crimson", md: "tomato", lg: "limegreen" }}
                  display={["none", "none", "none", "block"]}
                  overflowY="auto"
                >
                  <Stack
                    position={{
                      sm: "relative",
                      md: "relative",
                      lg: "fixed",
                      xl: "fixed",
                    }}
                    maxWidth={{
                      sm: "100%",
                      md: "100%",
                      lg: "250px",
                      xl: "250px",
                    }}
                    width="100%"
                  >
                    <Button>create new thread</Button>
                    {dataThreads?.getOnlyThreads?.edges.map(
                      ({ node: { id, invitees, last_message } }) => {
                        return (
                          <Flex
                            bg="#eee"
                            p={2}
                            alignItems="center"
                            key={id}
                            onClick={() => {
                              // eslint-disable-next-line no-console
                              console.log("OH NO");

                              if (invitees && id && invitees.length > 0) {
                                setThreadId(id);
                                setInvitees(invitees);
                                setFieldValue(
                                  "sentTo",
                                  invitees.filter(
                                    ({ id: userId }) => userId !== id
                                  )[0].id
                                );
                                setFieldValue("threadId", id);
                                setFieldValue("invitees", invitees);
                              }
                            }}
                          >
                            <Text isTruncated>{last_message}</Text>
                            <Avatar ml="auto" />
                          </Flex>
                        );
                      }
                    )}
                  </Stack>
                </Grid>

                <Flex
                  bg="rgba(255,255,255)"
                  border="1px solid #eee"
                  position="fixed"
                  top={0 + 53}
                  w="100%"
                  alignItems="center"
                  zIndex={3}
                >
                  {!threadId ? (
                    <Stack
                      display={["flex", "flex", "none", "none"]}
                      position={{
                        sm: "relative",
                        md: "relative",
                        lg: "fixed",
                        xl: "fixed",
                      }}
                      maxWidth={{
                        sm: "100%",
                        md: "100%",
                        lg: "250px",
                        xl: "250px",
                      }}
                      width="100%"
                    >
                      <Button type="button" colorScheme="orange">
                        create new thread
                      </Button>

                      {dataThreads?.getOnlyThreads?.edges.map(
                        ({ node: { id, invitees, last_message } }) => {
                          return (
                            <Flex
                              bg="#eee"
                              p={2}
                              alignItems="center"
                              key={id}
                              onClick={() => {
                                // eslint-disable-next-line no-console
                                console.log("OH NO");

                                if (invitees && id && invitees.length > 0) {
                                  setThreadId(id);
                                  setInvitees(invitees);
                                  setFieldValue(
                                    "sentTo",
                                    invitees.filter(
                                      ({ id: userId }) => userId !== id
                                    )[0].id
                                  );
                                  setFieldValue("threadId", id);
                                  setFieldValue("invitees", invitees);
                                }
                                // getMessages({
                                //   variables: {
                                //     input: {
                                //       threadId: id ? id : ""
                                //     }
                                //   }
                                // });
                              }}
                            >
                              <Text isTruncated>{last_message}</Text>
                              <Avatar ml="auto" />
                            </Flex>
                          );
                        }
                      )}
                    </Stack>
                  ) : null}
                  {invitees?.map((user) => (
                    <Flex
                      key={user.id}
                      mx={2}
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Avatar
                        name={user.username}
                        src={user.profileImageUri ?? ""}
                      />
                      <Text isTruncated>{user.username}</Text>
                    </Flex>
                  ))}
                  {threadId ? (
                    <Button
                      type="button"
                      colorScheme="teal"
                      // position="absolute"
                      bottom={0}
                      right={0}
                      onClick={() => {
                        setThreadId(undefined);
                        setInvitees([]);
                        setFieldValue("threadId", "");
                        setFieldValue("invitees", []);
                      }}
                    >
                      show threads
                    </Button>
                  ) : null}
                </Flex>
              </>
            </MessagesGrid>
          </LayoutAuthenticated>
        );
      }}
    </Formik>
  );
};

export default Messages;
