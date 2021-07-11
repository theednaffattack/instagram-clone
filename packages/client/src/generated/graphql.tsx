import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type AddMessagePayload = {
  __typename?: "AddMessagePayload";
  success: Scalars["Boolean"];
  threadId: Scalars["ID"];
  message: Message;
  user: User;
  invitees: Array<User>;
};

export type AddMessageToThreadInputType = {
  threadId: Scalars["ID"];
  sentTo: Scalars["String"];
  invitees: Array<Scalars["ID"]>;
  message: Scalars["String"];
  images?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type ChangePasswordInput = {
  password: Scalars["String"];
  token: Scalars["String"];
};

export type Comment = {
  __typename?: "Comment";
  id: Scalars["ID"];
  postId: Scalars["ID"];
  post: Post;
  userId: Scalars["ID"];
  user: User;
  created_at?: Maybe<Scalars["DateTime"]>;
  updated_at?: Maybe<Scalars["DateTime"]>;
  content: Scalars["String"];
};

export type FeedInput = {
  cursor?: Maybe<Scalars["String"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type FieldError = {
  __typename?: "FieldError";
  field: Scalars["String"];
  message: Scalars["String"];
};

export type File = {
  __typename?: "File";
  id: Scalars["ID"];
  uri: Scalars["String"];
  file_type: FileTypeEnum;
  message?: Maybe<Message>;
  upload_user: User;
};

/** css | csv | image-all | pdf | svg | docx | other */
export enum FileTypeEnum {
  Css = "CSS",
  Csv = "CSV",
  Image = "IMAGE",
  Pdf = "PDF",
  Svg = "SVG",
  Md = "MD",
  Doc = "DOC",
  Other = "OTHER",
}

export type GetGlobalPostByIdInput = {
  postId: Scalars["ID"];
};

export type GetMessagesByThreadIdInput = {
  cursor?: Maybe<Scalars["String"]>;
  threadId: Scalars["String"];
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type GlobalPostResponse = {
  __typename?: "GlobalPostResponse";
  id?: Maybe<Scalars["ID"]>;
  title?: Maybe<Scalars["String"]>;
  text?: Maybe<Scalars["String"]>;
  images?: Maybe<Array<Image>>;
  likes?: Maybe<Array<Like>>;
  comments?: Maybe<Array<Comment>>;
  user?: Maybe<User>;
  created_at?: Maybe<Scalars["DateTime"]>;
  updated_at?: Maybe<Scalars["DateTime"]>;
  isCtxUserIdAFollowerOfPostUser?: Maybe<Scalars["Boolean"]>;
  comments_count: Scalars["Int"];
  likes_count: Scalars["Int"];
  currently_liked: Scalars["Boolean"];
  success?: Maybe<Scalars["Boolean"]>;
  action?: Maybe<Scalars["String"]>;
  date_formatted?: Maybe<Scalars["String"]>;
};

export type HelloInput = {
  userInput: Scalars["String"];
};

export type Image = {
  __typename?: "Image";
  id: Scalars["ID"];
  created_at?: Maybe<Scalars["DateTime"]>;
  updated_at?: Maybe<Scalars["DateTime"]>;
  uri: Scalars["String"];
  post: Post;
  message?: Maybe<Message>;
  user: User;
};

export type ImageSubInput = {
  lastModified: Scalars["Float"];
  name: Scalars["String"];
  size: Scalars["Int"];
  type: Scalars["String"];
};

export type Like = {
  __typename?: "Like";
  id: Scalars["ID"];
  postId: Scalars["ID"];
  post: Post;
  userId: Scalars["ID"];
  user: User;
  count: Scalars["Int"];
};

export type LikeReturnType = {
  __typename?: "LikeReturnType";
  postId: Scalars["ID"];
  status: LikeStatus;
};

/** Describes whether a like has been created or deleted in the database. */
export enum LikeStatus {
  Created = "Created",
  Deleted = "Deleted",
  CountUpdated = "CountUpdated",
  Undetermined = "Undetermined",
}

export type LoginResponse = {
  __typename?: "LoginResponse";
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type Message = {
  __typename?: "Message";
  id: Scalars["ID"];
  created_at?: Maybe<Scalars["DateTime"]>;
  updated_at?: Maybe<Scalars["DateTime"]>;
  text: Scalars["String"];
  files?: Maybe<Array<Maybe<File>>>;
  images?: Maybe<Array<Maybe<Image>>>;
  sentBy: User;
  user: User;
  thread?: Maybe<Thread>;
};

export type MessageConnection = {
  __typename?: "MessageConnection";
  edges: Array<MessageEdge>;
  pageInfo: PageInfo;
};

export type MessageEdge = {
  __typename?: "MessageEdge";
  cursor: Scalars["String"];
  node: Message;
};

export type Mutation = {
  __typename?: "Mutation";
  addMessageToThread: AddMessagePayload;
  login: LoginResponse;
  register: RegisterResponse;
  signS3: SignedS3Payload;
  forgotPassword: Scalars["Boolean"];
  createPost: Post;
  createOrUpdateLikes?: Maybe<LikeReturnType>;
  confirmUser: Scalars["Boolean"];
  changePassword?: Maybe<UserResponse>;
  createMessageThread: Thread;
  logout: Scalars["Boolean"];
  helloWithUserInput?: Maybe<Scalars["String"]>;
};

export type MutationAddMessageToThreadArgs = {
  threadId: Scalars["ID"];
  sentTo: Scalars["String"];
  invitees: Array<Scalars["ID"]>;
  message: Scalars["String"];
  images?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type MutationLoginArgs = {
  password: Scalars["String"];
  username: Scalars["String"];
};

export type MutationRegisterArgs = {
  data: RegisterInput;
};

export type MutationSignS3Args = {
  files: Array<ImageSubInput>;
};

export type MutationForgotPasswordArgs = {
  email: Scalars["String"];
};

export type MutationCreatePostArgs = {
  data: PostInput;
};

export type MutationCreateOrUpdateLikesArgs = {
  input: UpdateLikesInput;
};

export type MutationConfirmUserArgs = {
  token: Scalars["String"];
};

export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};

export type MutationCreateMessageThreadArgs = {
  threadId: Scalars["ID"];
  sentTo: Scalars["String"];
  invitees: Array<Scalars["ID"]>;
  message: Scalars["String"];
  images?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type MutationHelloWithUserInputArgs = {
  data: HelloInput;
};

export type PageInfo = {
  __typename?: "PageInfo";
  startCursor: Scalars["String"];
  endCursor: Scalars["String"];
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
};

export type PageInfoType = {
  __typename?: "PageInfoType";
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
  startCursor?: Maybe<Scalars["String"]>;
  endCursor?: Maybe<Scalars["String"]>;
};

export type PaginatedPosts = {
  __typename?: "PaginatedPosts";
  posts: Array<GlobalPostResponse>;
  hasMore: Scalars["Boolean"];
};

export type Post = {
  __typename?: "Post";
  id?: Maybe<Scalars["ID"]>;
  title?: Maybe<Scalars["String"]>;
  text?: Maybe<Scalars["String"]>;
  images?: Maybe<Array<Image>>;
  likes?: Maybe<Array<Like>>;
  comments?: Maybe<Array<Comment>>;
  isCtxUserIdAFollowerOfPostUser?: Maybe<Scalars["Boolean"]>;
  userId?: Maybe<Scalars["ID"]>;
  user?: Maybe<User>;
  created_at?: Maybe<Scalars["DateTime"]>;
  updated_at?: Maybe<Scalars["DateTime"]>;
  comments_count: Scalars["Int"];
  likes_count: Scalars["Int"];
};

export type PostConnection = {
  __typename?: "PostConnection";
  pageInfo: PageInfoType;
  edges: Array<PostEdge>;
};

export type PostEdge = {
  __typename?: "PostEdge";
  node: GlobalPostResponse;
  /** Used in `before` and `after` args */
  cursor: Scalars["String"];
};

export type PostInput = {
  text: Scalars["String"];
  title?: Maybe<Scalars["String"]>;
  images?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type PostSubInput = {
  sentBy: Scalars["String"];
  message: Scalars["String"];
};

export type PostSubType = {
  __typename?: "PostSubType";
  id: Scalars["ID"];
  title: Scalars["String"];
  text: Scalars["String"];
  images: Array<Image>;
  user: User;
  created_at: Scalars["DateTime"];
  updated_at: Scalars["DateTime"];
};

export type Query = {
  __typename?: "Query";
  getMessagesByThreadId?: Maybe<MessageConnection>;
  getOnlyThreads?: Maybe<ThreadConnection>;
  helloWorld: Scalars["String"];
  me?: Maybe<User>;
  getListToCreateThread?: Maybe<TransUserReturn>;
  getGlobalPosts?: Maybe<Array<GlobalPostResponse>>;
  getGlobalPostsSimplePagination?: Maybe<PaginatedPosts>;
  getGlobalPostsRelay?: Maybe<PostConnection>;
  getGlobalPostById?: Maybe<GlobalPostResponse>;
};

export type QueryGetMessagesByThreadIdArgs = {
  input: GetMessagesByThreadIdInput;
};

export type QueryGetOnlyThreadsArgs = {
  feedinput: FeedInput;
};

export type QueryGetGlobalPostsArgs = {
  cursor?: Maybe<Scalars["String"]>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
};

export type QueryGetGlobalPostsSimplePaginationArgs = {
  before?: Maybe<Scalars["String"]>;
  after?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Float"]>;
  last?: Maybe<Scalars["Float"]>;
};

export type QueryGetGlobalPostsRelayArgs = {
  before?: Maybe<Scalars["String"]>;
  after?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Float"]>;
  last?: Maybe<Scalars["Float"]>;
};

export type QueryGetGlobalPostByIdArgs = {
  getpostinput: GetGlobalPostByIdInput;
};

export type RegisterInput = {
  password: Scalars["String"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  username: Scalars["String"];
  email: Scalars["String"];
};

export type RegisterResponse = {
  __typename?: "RegisterResponse";
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type SignedS3Payload = {
  __typename?: "SignedS3Payload";
  signatures: Array<SignedS3SubPayload>;
};

export type SignedS3SubPayload = {
  __typename?: "SignedS3SubPayload";
  url: Scalars["String"];
  signedRequest: Scalars["String"];
};

export type Subscription = {
  __typename?: "Subscription";
  messageThreads: AddMessagePayload;
  getMessagesByThreadId: AddMessagePayload;
  globalPosts?: Maybe<GlobalPostResponse>;
  globalPostsRelay?: Maybe<PostConnection>;
  followingPosts: PostSubType;
  likesUpdated: LikeReturnType;
};

export type SubscriptionMessageThreadsArgs = {
  data: AddMessageToThreadInputType;
};

export type SubscriptionGetMessagesByThreadIdArgs = {
  input: GetMessagesByThreadIdInput;
};

export type SubscriptionFollowingPostsArgs = {
  data: PostSubInput;
};

export type Thread = {
  __typename?: "Thread";
  id?: Maybe<Scalars["ID"]>;
  messages?: Maybe<Array<Maybe<Message>>>;
  last_message?: Maybe<Scalars["String"]>;
  message_count: Scalars["Int"];
  user: User;
  invitees: Array<User>;
  created_at?: Maybe<Scalars["DateTime"]>;
  updated_at?: Maybe<Scalars["DateTime"]>;
};

export type ThreadConnection = {
  __typename?: "ThreadConnection";
  edges: Array<ThreadEdge>;
  pageInfo: PageInfo;
};

export type ThreadEdge = {
  __typename?: "ThreadEdge";
  node: Thread;
};

export type TransUserReturn = {
  __typename?: "TransUserReturn";
  id: Scalars["ID"];
  thoseICanMessage?: Maybe<Array<User>>;
};

export type UpdateLikesInput = {
  postId: Scalars["ID"];
};

export type User = {
  __typename?: "User";
  id?: Maybe<Scalars["ID"]>;
  created_at?: Maybe<Scalars["DateTime"]>;
  updated_at?: Maybe<Scalars["DateTime"]>;
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  username?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  files?: Maybe<Array<Maybe<File>>>;
  images?: Maybe<Array<Maybe<Image>>>;
  likes?: Maybe<Array<Like>>;
  mappedMessages?: Maybe<Array<Maybe<Message>>>;
  posts?: Maybe<Post>;
  followers?: Maybe<Array<Maybe<User>>>;
  following?: Maybe<Array<Maybe<User>>>;
  profileImageUri?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  messages?: Maybe<Array<Message>>;
  sent_messages?: Maybe<Array<Message>>;
  threads?: Maybe<Array<Maybe<Thread>>>;
  thread_invitations?: Maybe<Array<Maybe<Thread>>>;
};

export type UserResponse = {
  __typename?: "UserResponse";
  errors?: Maybe<FieldError>;
  user?: Maybe<User>;
};

export type ErrorTypicalFragment = { __typename?: "FieldError" } & Pick<
  FieldError,
  "field" | "message"
>;

export type TypicalUserResponseFragment = { __typename?: "UserResponse" } & {
  errors?: Maybe<{ __typename?: "FieldError" } & ErrorTypicalFragment>;
  user?: Maybe<{ __typename?: "User" } & UserBaseFragment>;
};

export type UserBaseFragment = { __typename?: "User" } & Pick<
  User,
  "id" | "username"
>;

export type AddMessageToThreadMutationVariables = Exact<{
  threadId: Scalars["ID"];
  sentTo: Scalars["String"];
  invitees: Array<Scalars["ID"]> | Scalars["ID"];
  message: Scalars["String"];
  images?: Maybe<Array<Maybe<Scalars["String"]>> | Maybe<Scalars["String"]>>;
}>;

export type AddMessageToThreadMutation = { __typename?: "Mutation" } & {
  addMessageToThread: { __typename?: "AddMessagePayload" } & Pick<
    AddMessagePayload,
    "success" | "threadId"
  > & {
      message: { __typename?: "Message" } & Pick<
        Message,
        "id" | "created_at" | "text"
      >;
      user: { __typename?: "User" } & Pick<
        User,
        "id" | "username" | "profileImageUri"
      >;
    };
};

export type ChangePasswordMutationVariables = Exact<{
  data: ChangePasswordInput;
}>;

export type ChangePasswordMutation = { __typename?: "Mutation" } & {
  changePassword?: Maybe<
    { __typename?: "UserResponse" } & TypicalUserResponseFragment
  >;
};

export type ConfirmUserMutationVariables = Exact<{
  token: Scalars["String"];
}>;

export type ConfirmUserMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "confirmUser"
>;

export type CreateMessageThreadMutationVariables = Exact<{
  sentTo: Scalars["String"];
  invitees: Array<Scalars["ID"]> | Scalars["ID"];
  message: Scalars["String"];
  images?: Maybe<Array<Maybe<Scalars["String"]>> | Maybe<Scalars["String"]>>;
  threadId: Scalars["ID"];
}>;

export type CreateMessageThreadMutation = { __typename?: "Mutation" } & {
  createMessageThread: { __typename?: "Thread" } & Pick<
    Thread,
    "id" | "last_message" | "message_count" | "created_at"
  > & {
      invitees: Array<{ __typename?: "User" } & Pick<User, "id" | "username">>;
    };
};

export type CreateOrUpdateLikesMutationVariables = Exact<{
  input: UpdateLikesInput;
}>;

export type CreateOrUpdateLikesMutation = { __typename?: "Mutation" } & {
  createOrUpdateLikes?: Maybe<
    { __typename?: "LikeReturnType" } & Pick<
      LikeReturnType,
      "postId" | "status"
    >
  >;
};

export type CreatePostMutationVariables = Exact<{
  data: PostInput;
}>;

export type CreatePostMutation = { __typename?: "Mutation" } & {
  createPost: { __typename?: "Post" } & Pick<Post, "id" | "title" | "text"> & {
      images?: Maybe<
        Array<{ __typename?: "Image" } & Pick<Image, "id" | "uri">>
      >;
    };
};

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars["String"];
}>;

export type ForgotPasswordMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "forgotPassword"
>;

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "logout"
>;

export type RegisterMutationVariables = Exact<{
  data: RegisterInput;
}>;

export type RegisterMutation = { __typename?: "Mutation" } & {
  register: { __typename?: "RegisterResponse" } & {
    user?: Maybe<{ __typename?: "User" } & Pick<User, "id" | "username">>;
    errors?: Maybe<
      Array<
        { __typename?: "FieldError" } & Pick<FieldError, "field" | "message">
      >
    >;
  };
};

export type SignS3MutationVariables = Exact<{
  files: Array<ImageSubInput> | ImageSubInput;
}>;

export type SignS3Mutation = { __typename?: "Mutation" } & {
  signS3: { __typename?: "SignedS3Payload" } & {
    signatures: Array<
      { __typename?: "SignedS3SubPayload" } & Pick<
        SignedS3SubPayload,
        "url" | "signedRequest"
      >
    >;
  };
};

export type GetGlobalPostByIdQueryVariables = Exact<{
  getpostinput: GetGlobalPostByIdInput;
}>;

export type GetGlobalPostByIdQuery = { __typename?: "Query" } & {
  getGlobalPostById?: Maybe<
    { __typename?: "GlobalPostResponse" } & Pick<
      GlobalPostResponse,
      "id" | "title" | "text"
    > & {
        images?: Maybe<
          Array<{ __typename?: "Image" } & Pick<Image, "id" | "uri">>
        >;
      }
  >;
};

export type GetGlobalPostsRelayQueryVariables = Exact<{
  before?: Maybe<Scalars["String"]>;
  after?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Float"]>;
  last?: Maybe<Scalars["Float"]>;
}>;

export type GetGlobalPostsRelayQuery = { __typename?: "Query" } & {
  getGlobalPostsRelay?: Maybe<
    { __typename?: "PostConnection" } & {
      pageInfo: { __typename?: "PageInfoType" } & Pick<
        PageInfoType,
        "hasNextPage" | "hasPreviousPage" | "endCursor" | "startCursor"
      >;
      edges: Array<
        { __typename?: "PostEdge" } & Pick<PostEdge, "cursor"> & {
            node: { __typename?: "GlobalPostResponse" } & Pick<
              GlobalPostResponse,
              | "id"
              | "title"
              | "text"
              | "likes_count"
              | "comments_count"
              | "currently_liked"
              | "created_at"
              | "date_formatted"
            > & {
                user?: Maybe<
                  { __typename?: "User" } & Pick<
                    User,
                    "id" | "username" | "profileImageUri"
                  >
                >;
                images?: Maybe<
                  Array<{ __typename?: "Image" } & Pick<Image, "id" | "uri">>
                >;
                likes?: Maybe<
                  Array<{ __typename?: "Like" } & Pick<Like, "id">>
                >;
              };
          }
      >;
    }
  >;
};

export type GetGlobalPostsSimplePaginationQueryVariables = Exact<{
  after?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Float"]>;
}>;

export type GetGlobalPostsSimplePaginationQuery = { __typename?: "Query" } & {
  getGlobalPostsSimplePagination?: Maybe<
    { __typename?: "PaginatedPosts" } & Pick<PaginatedPosts, "hasMore"> & {
        posts: Array<
          { __typename?: "GlobalPostResponse" } & Pick<
            GlobalPostResponse,
            "id" | "title" | "text" | "created_at"
          > & {
              images?: Maybe<
                Array<{ __typename?: "Image" } & Pick<Image, "id" | "uri">>
              >;
            }
        >;
      }
  >;
};

export type GetGlobalPostsQueryVariables = Exact<{
  cursor?: Maybe<Scalars["String"]>;
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
}>;

export type GetGlobalPostsQuery = { __typename?: "Query" } & {
  getGlobalPosts?: Maybe<
    Array<
      { __typename?: "GlobalPostResponse" } & Pick<
        GlobalPostResponse,
        "id" | "title" | "text" | "created_at"
      > & {
          images?: Maybe<
            Array<{ __typename?: "Image" } & Pick<Image, "id" | "uri">>
          >;
          likes?: Maybe<
            Array<{ __typename?: "Like" } & Pick<Like, "id" | "count">>
          >;
        }
    >
  >;
};

export type GetListToCreateThreadQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetListToCreateThreadQuery = { __typename?: "Query" } & {
  getListToCreateThread?: Maybe<
    { __typename?: "TransUserReturn" } & Pick<TransUserReturn, "id"> & {
        thoseICanMessage?: Maybe<
          Array<
            { __typename?: "User" } & Pick<
              User,
              "id" | "username" | "profileImageUri"
            >
          >
        >;
      }
  >;
};

export type GetMessagesByThreadIdQueryVariables = Exact<{
  input: GetMessagesByThreadIdInput;
}>;

export type GetMessagesByThreadIdQuery = { __typename?: "Query" } & {
  getMessagesByThreadId?: Maybe<
    { __typename?: "MessageConnection" } & {
      edges: Array<
        { __typename?: "MessageEdge" } & {
          node: { __typename?: "Message" } & Pick<
            Message,
            "id" | "created_at" | "text"
          > & {
              sentBy: { __typename?: "User" } & Pick<
                User,
                "id" | "profileImageUri"
              >;
            };
        }
      >;
      pageInfo: { __typename?: "PageInfo" } & Pick<
        PageInfo,
        "startCursor" | "endCursor" | "hasNextPage" | "hasPreviousPage"
      >;
    }
  >;
};

export type GetOnlyThreadsQueryVariables = Exact<{
  feedinput: FeedInput;
}>;

export type GetOnlyThreadsQuery = { __typename?: "Query" } & {
  getOnlyThreads?: Maybe<
    { __typename?: "ThreadConnection" } & {
      edges: Array<
        { __typename?: "ThreadEdge" } & {
          node: { __typename?: "Thread" } & Pick<
            Thread,
            "id" | "last_message" | "created_at"
          > & {
              user: { __typename?: "User" } & Pick<User, "id" | "username">;
              invitees: Array<
                { __typename?: "User" } & Pick<
                  User,
                  "id" | "username" | "profileImageUri"
                >
              >;
            };
        }
      >;
      pageInfo: { __typename?: "PageInfo" } & Pick<
        PageInfo,
        "startCursor" | "endCursor" | "hasNextPage" | "hasPreviousPage"
      >;
    }
  >;
};

export type LoginMutationVariables = Exact<{
  username: Scalars["String"];
  password: Scalars["String"];
}>;

export type LoginMutation = { __typename?: "Mutation" } & {
  login: { __typename?: "LoginResponse" } & {
    errors?: Maybe<
      Array<
        { __typename?: "FieldError" } & Pick<FieldError, "field" | "message">
      >
    >;
    user?: Maybe<{ __typename?: "User" } & Pick<User, "id" | "username">>;
  };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: "Query" } & {
  me?: Maybe<{ __typename?: "User" } & UserBaseFragment>;
};

export const ErrorTypicalFragmentDoc = gql`
  fragment ErrorTypical on FieldError {
    field
    message
  }
`;
export const UserBaseFragmentDoc = gql`
  fragment UserBase on User {
    id
    username
  }
`;
export const TypicalUserResponseFragmentDoc = gql`
  fragment TypicalUserResponse on UserResponse {
    errors {
      ...ErrorTypical
    }
    user {
      ...UserBase
    }
  }
  ${ErrorTypicalFragmentDoc}
  ${UserBaseFragmentDoc}
`;
export const AddMessageToThreadDocument = gql`
  mutation AddMessageToThread(
    $threadId: ID!
    $sentTo: String!
    $invitees: [ID!]!
    $message: String!
    $images: [String]
  ) {
    addMessageToThread(
      threadId: $threadId
      sentTo: $sentTo
      invitees: $invitees
      message: $message
      images: $images
    ) {
      success
      threadId
      message {
        id
        created_at
        text
      }
      user {
        id
        username
        profileImageUri
      }
    }
  }
`;
export type AddMessageToThreadMutationFn = Apollo.MutationFunction<
  AddMessageToThreadMutation,
  AddMessageToThreadMutationVariables
>;

/**
 * __useAddMessageToThreadMutation__
 *
 * To run a mutation, you first call `useAddMessageToThreadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMessageToThreadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMessageToThreadMutation, { data, loading, error }] = useAddMessageToThreadMutation({
 *   variables: {
 *      threadId: // value for 'threadId'
 *      sentTo: // value for 'sentTo'
 *      invitees: // value for 'invitees'
 *      message: // value for 'message'
 *      images: // value for 'images'
 *   },
 * });
 */
export function useAddMessageToThreadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddMessageToThreadMutation,
    AddMessageToThreadMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddMessageToThreadMutation,
    AddMessageToThreadMutationVariables
  >(AddMessageToThreadDocument, options);
}
export type AddMessageToThreadMutationHookResult = ReturnType<
  typeof useAddMessageToThreadMutation
>;
export type AddMessageToThreadMutationResult =
  Apollo.MutationResult<AddMessageToThreadMutation>;
export type AddMessageToThreadMutationOptions = Apollo.BaseMutationOptions<
  AddMessageToThreadMutation,
  AddMessageToThreadMutationVariables
>;
export const ChangePasswordDocument = gql`
  mutation ChangePassword($data: ChangePasswordInput!) {
    changePassword(data: $data) {
      ...TypicalUserResponse
    }
  }
  ${TypicalUserResponseFragmentDoc}
`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useChangePasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(ChangePasswordDocument, options);
}
export type ChangePasswordMutationHookResult = ReturnType<
  typeof useChangePasswordMutation
>;
export type ChangePasswordMutationResult =
  Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>;
export const ConfirmUserDocument = gql`
  mutation ConfirmUser($token: String!) {
    confirmUser(token: $token)
  }
`;
export type ConfirmUserMutationFn = Apollo.MutationFunction<
  ConfirmUserMutation,
  ConfirmUserMutationVariables
>;

/**
 * __useConfirmUserMutation__
 *
 * To run a mutation, you first call `useConfirmUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmUserMutation, { data, loading, error }] = useConfirmUserMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useConfirmUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ConfirmUserMutation,
    ConfirmUserMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ConfirmUserMutation, ConfirmUserMutationVariables>(
    ConfirmUserDocument,
    options
  );
}
export type ConfirmUserMutationHookResult = ReturnType<
  typeof useConfirmUserMutation
>;
export type ConfirmUserMutationResult =
  Apollo.MutationResult<ConfirmUserMutation>;
export type ConfirmUserMutationOptions = Apollo.BaseMutationOptions<
  ConfirmUserMutation,
  ConfirmUserMutationVariables
>;
export const CreateMessageThreadDocument = gql`
  mutation CreateMessageThread(
    $sentTo: String!
    $invitees: [ID!]!
    $message: String!
    $images: [String]
    $threadId: ID!
  ) {
    createMessageThread(
      sentTo: $sentTo
      invitees: $invitees
      message: $message
      images: $images
      threadId: $threadId
    ) {
      id
      last_message
      message_count
      created_at
      invitees {
        id
        username
      }
    }
  }
`;
export type CreateMessageThreadMutationFn = Apollo.MutationFunction<
  CreateMessageThreadMutation,
  CreateMessageThreadMutationVariables
>;

/**
 * __useCreateMessageThreadMutation__
 *
 * To run a mutation, you first call `useCreateMessageThreadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageThreadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageThreadMutation, { data, loading, error }] = useCreateMessageThreadMutation({
 *   variables: {
 *      sentTo: // value for 'sentTo'
 *      invitees: // value for 'invitees'
 *      message: // value for 'message'
 *      images: // value for 'images'
 *      threadId: // value for 'threadId'
 *   },
 * });
 */
export function useCreateMessageThreadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateMessageThreadMutation,
    CreateMessageThreadMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateMessageThreadMutation,
    CreateMessageThreadMutationVariables
  >(CreateMessageThreadDocument, options);
}
export type CreateMessageThreadMutationHookResult = ReturnType<
  typeof useCreateMessageThreadMutation
>;
export type CreateMessageThreadMutationResult =
  Apollo.MutationResult<CreateMessageThreadMutation>;
export type CreateMessageThreadMutationOptions = Apollo.BaseMutationOptions<
  CreateMessageThreadMutation,
  CreateMessageThreadMutationVariables
>;
export const CreateOrUpdateLikesDocument = gql`
  mutation CreateOrUpdateLikes($input: UpdateLikesInput!) {
    createOrUpdateLikes(input: $input) {
      postId
      status
    }
  }
`;
export type CreateOrUpdateLikesMutationFn = Apollo.MutationFunction<
  CreateOrUpdateLikesMutation,
  CreateOrUpdateLikesMutationVariables
>;

/**
 * __useCreateOrUpdateLikesMutation__
 *
 * To run a mutation, you first call `useCreateOrUpdateLikesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOrUpdateLikesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOrUpdateLikesMutation, { data, loading, error }] = useCreateOrUpdateLikesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateOrUpdateLikesMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateOrUpdateLikesMutation,
    CreateOrUpdateLikesMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateOrUpdateLikesMutation,
    CreateOrUpdateLikesMutationVariables
  >(CreateOrUpdateLikesDocument, options);
}
export type CreateOrUpdateLikesMutationHookResult = ReturnType<
  typeof useCreateOrUpdateLikesMutation
>;
export type CreateOrUpdateLikesMutationResult =
  Apollo.MutationResult<CreateOrUpdateLikesMutation>;
export type CreateOrUpdateLikesMutationOptions = Apollo.BaseMutationOptions<
  CreateOrUpdateLikesMutation,
  CreateOrUpdateLikesMutationVariables
>;
export const CreatePostDocument = gql`
  mutation CreatePost($data: PostInput!) {
    createPost(data: $data) {
      id
      title
      text
      images {
        id
        uri
      }
    }
  }
`;
export type CreatePostMutationFn = Apollo.MutationFunction<
  CreatePostMutation,
  CreatePostMutationVariables
>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreatePostMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePostMutation,
    CreatePostMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(
    CreatePostDocument,
    options
  );
}
export type CreatePostMutationHookResult = ReturnType<
  typeof useCreatePostMutation
>;
export type CreatePostMutationResult =
  Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<
  CreatePostMutation,
  CreatePostMutationVariables
>;
export const ForgotPasswordDocument = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >(ForgotPasswordDocument, options);
}
export type ForgotPasswordMutationHookResult = ReturnType<
  typeof useForgotPasswordMutation
>;
export type ForgotPasswordMutationResult =
  Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>;
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;
export type LogoutMutationFn = Apollo.MutationFunction<
  LogoutMutation,
  LogoutMutationVariables
>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    options
  );
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>;
export const RegisterDocument = gql`
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      user {
        id
        username
      }
      errors {
        field
        message
      }
    }
  }
`;
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    options
  );
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
export const SignS3Document = gql`
  mutation SignS3($files: [ImageSubInput!]!) {
    signS3(files: $files) {
      signatures {
        url
        signedRequest
      }
    }
  }
`;
export type SignS3MutationFn = Apollo.MutationFunction<
  SignS3Mutation,
  SignS3MutationVariables
>;

/**
 * __useSignS3Mutation__
 *
 * To run a mutation, you first call `useSignS3Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignS3Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signS3Mutation, { data, loading, error }] = useSignS3Mutation({
 *   variables: {
 *      files: // value for 'files'
 *   },
 * });
 */
export function useSignS3Mutation(
  baseOptions?: Apollo.MutationHookOptions<
    SignS3Mutation,
    SignS3MutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SignS3Mutation, SignS3MutationVariables>(
    SignS3Document,
    options
  );
}
export type SignS3MutationHookResult = ReturnType<typeof useSignS3Mutation>;
export type SignS3MutationResult = Apollo.MutationResult<SignS3Mutation>;
export type SignS3MutationOptions = Apollo.BaseMutationOptions<
  SignS3Mutation,
  SignS3MutationVariables
>;
export const GetGlobalPostByIdDocument = gql`
  query GetGlobalPostById($getpostinput: GetGlobalPostByIdInput!) {
    getGlobalPostById(getpostinput: $getpostinput) {
      id
      title
      text
      images {
        id
        uri
      }
    }
  }
`;

/**
 * __useGetGlobalPostByIdQuery__
 *
 * To run a query within a React component, call `useGetGlobalPostByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGlobalPostByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGlobalPostByIdQuery({
 *   variables: {
 *      getpostinput: // value for 'getpostinput'
 *   },
 * });
 */
export function useGetGlobalPostByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetGlobalPostByIdQuery,
    GetGlobalPostByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetGlobalPostByIdQuery,
    GetGlobalPostByIdQueryVariables
  >(GetGlobalPostByIdDocument, options);
}
export function useGetGlobalPostByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetGlobalPostByIdQuery,
    GetGlobalPostByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetGlobalPostByIdQuery,
    GetGlobalPostByIdQueryVariables
  >(GetGlobalPostByIdDocument, options);
}
export type GetGlobalPostByIdQueryHookResult = ReturnType<
  typeof useGetGlobalPostByIdQuery
>;
export type GetGlobalPostByIdLazyQueryHookResult = ReturnType<
  typeof useGetGlobalPostByIdLazyQuery
>;
export type GetGlobalPostByIdQueryResult = Apollo.QueryResult<
  GetGlobalPostByIdQuery,
  GetGlobalPostByIdQueryVariables
>;
export const GetGlobalPostsRelayDocument = gql`
  query GetGlobalPostsRelay(
    $before: String
    $after: String
    $first: Float
    $last: Float
  ) {
    getGlobalPostsRelay(
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      edges {
        cursor
        node {
          id
          title
          text
          likes_count
          comments_count
          currently_liked
          user {
            id
            username
            profileImageUri
          }
          images {
            id
            uri
          }
          likes {
            id
          }
          created_at
          date_formatted
        }
      }
    }
  }
`;

/**
 * __useGetGlobalPostsRelayQuery__
 *
 * To run a query within a React component, call `useGetGlobalPostsRelayQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGlobalPostsRelayQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGlobalPostsRelayQuery({
 *   variables: {
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *   },
 * });
 */
export function useGetGlobalPostsRelayQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetGlobalPostsRelayQuery,
    GetGlobalPostsRelayQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetGlobalPostsRelayQuery,
    GetGlobalPostsRelayQueryVariables
  >(GetGlobalPostsRelayDocument, options);
}
export function useGetGlobalPostsRelayLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetGlobalPostsRelayQuery,
    GetGlobalPostsRelayQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetGlobalPostsRelayQuery,
    GetGlobalPostsRelayQueryVariables
  >(GetGlobalPostsRelayDocument, options);
}
export type GetGlobalPostsRelayQueryHookResult = ReturnType<
  typeof useGetGlobalPostsRelayQuery
>;
export type GetGlobalPostsRelayLazyQueryHookResult = ReturnType<
  typeof useGetGlobalPostsRelayLazyQuery
>;
export type GetGlobalPostsRelayQueryResult = Apollo.QueryResult<
  GetGlobalPostsRelayQuery,
  GetGlobalPostsRelayQueryVariables
>;
export const GetGlobalPostsSimplePaginationDocument = gql`
  query GetGlobalPostsSimplePagination($after: String, $first: Float) {
    getGlobalPostsSimplePagination(after: $after, first: $first) {
      hasMore
      posts {
        id
        title
        text
        created_at
        images {
          id
          uri
        }
      }
    }
  }
`;

/**
 * __useGetGlobalPostsSimplePaginationQuery__
 *
 * To run a query within a React component, call `useGetGlobalPostsSimplePaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGlobalPostsSimplePaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGlobalPostsSimplePaginationQuery({
 *   variables: {
 *      after: // value for 'after'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetGlobalPostsSimplePaginationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetGlobalPostsSimplePaginationQuery,
    GetGlobalPostsSimplePaginationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetGlobalPostsSimplePaginationQuery,
    GetGlobalPostsSimplePaginationQueryVariables
  >(GetGlobalPostsSimplePaginationDocument, options);
}
export function useGetGlobalPostsSimplePaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetGlobalPostsSimplePaginationQuery,
    GetGlobalPostsSimplePaginationQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetGlobalPostsSimplePaginationQuery,
    GetGlobalPostsSimplePaginationQueryVariables
  >(GetGlobalPostsSimplePaginationDocument, options);
}
export type GetGlobalPostsSimplePaginationQueryHookResult = ReturnType<
  typeof useGetGlobalPostsSimplePaginationQuery
>;
export type GetGlobalPostsSimplePaginationLazyQueryHookResult = ReturnType<
  typeof useGetGlobalPostsSimplePaginationLazyQuery
>;
export type GetGlobalPostsSimplePaginationQueryResult = Apollo.QueryResult<
  GetGlobalPostsSimplePaginationQuery,
  GetGlobalPostsSimplePaginationQueryVariables
>;
export const GetGlobalPostsDocument = gql`
  query GetGlobalPosts($cursor: String, $skip: Int, $take: Int) {
    getGlobalPosts(cursor: $cursor, skip: $skip, take: $take) {
      id
      title
      text
      images {
        id
        uri
      }
      likes {
        id
        count
      }
      created_at
    }
  }
`;

/**
 * __useGetGlobalPostsQuery__
 *
 * To run a query within a React component, call `useGetGlobalPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGlobalPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGlobalPostsQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *   },
 * });
 */
export function useGetGlobalPostsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetGlobalPostsQuery,
    GetGlobalPostsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetGlobalPostsQuery, GetGlobalPostsQueryVariables>(
    GetGlobalPostsDocument,
    options
  );
}
export function useGetGlobalPostsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetGlobalPostsQuery,
    GetGlobalPostsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetGlobalPostsQuery, GetGlobalPostsQueryVariables>(
    GetGlobalPostsDocument,
    options
  );
}
export type GetGlobalPostsQueryHookResult = ReturnType<
  typeof useGetGlobalPostsQuery
>;
export type GetGlobalPostsLazyQueryHookResult = ReturnType<
  typeof useGetGlobalPostsLazyQuery
>;
export type GetGlobalPostsQueryResult = Apollo.QueryResult<
  GetGlobalPostsQuery,
  GetGlobalPostsQueryVariables
>;
export const GetListToCreateThreadDocument = gql`
  query GetListToCreateThread {
    getListToCreateThread {
      id
      thoseICanMessage {
        id
        username
        profileImageUri
      }
    }
  }
`;

/**
 * __useGetListToCreateThreadQuery__
 *
 * To run a query within a React component, call `useGetListToCreateThreadQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetListToCreateThreadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetListToCreateThreadQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetListToCreateThreadQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetListToCreateThreadQuery,
    GetListToCreateThreadQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetListToCreateThreadQuery,
    GetListToCreateThreadQueryVariables
  >(GetListToCreateThreadDocument, options);
}
export function useGetListToCreateThreadLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetListToCreateThreadQuery,
    GetListToCreateThreadQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetListToCreateThreadQuery,
    GetListToCreateThreadQueryVariables
  >(GetListToCreateThreadDocument, options);
}
export type GetListToCreateThreadQueryHookResult = ReturnType<
  typeof useGetListToCreateThreadQuery
>;
export type GetListToCreateThreadLazyQueryHookResult = ReturnType<
  typeof useGetListToCreateThreadLazyQuery
>;
export type GetListToCreateThreadQueryResult = Apollo.QueryResult<
  GetListToCreateThreadQuery,
  GetListToCreateThreadQueryVariables
>;
export const GetMessagesByThreadIdDocument = gql`
  query GetMessagesByThreadId($input: GetMessagesByThreadIdInput!) {
    getMessagesByThreadId(input: $input) {
      edges {
        node {
          id
          created_at
          text
          sentBy {
            id
            profileImageUri
          }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * __useGetMessagesByThreadIdQuery__
 *
 * To run a query within a React component, call `useGetMessagesByThreadIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesByThreadIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesByThreadIdQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetMessagesByThreadIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetMessagesByThreadIdQuery,
    GetMessagesByThreadIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetMessagesByThreadIdQuery,
    GetMessagesByThreadIdQueryVariables
  >(GetMessagesByThreadIdDocument, options);
}
export function useGetMessagesByThreadIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMessagesByThreadIdQuery,
    GetMessagesByThreadIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetMessagesByThreadIdQuery,
    GetMessagesByThreadIdQueryVariables
  >(GetMessagesByThreadIdDocument, options);
}
export type GetMessagesByThreadIdQueryHookResult = ReturnType<
  typeof useGetMessagesByThreadIdQuery
>;
export type GetMessagesByThreadIdLazyQueryHookResult = ReturnType<
  typeof useGetMessagesByThreadIdLazyQuery
>;
export type GetMessagesByThreadIdQueryResult = Apollo.QueryResult<
  GetMessagesByThreadIdQuery,
  GetMessagesByThreadIdQueryVariables
>;
export const GetOnlyThreadsDocument = gql`
  query GetOnlyThreads($feedinput: FeedInput!) {
    getOnlyThreads(feedinput: $feedinput) {
      edges {
        node {
          id
          user {
            id
            username
          }
          last_message
          created_at
          invitees {
            id
            username
            profileImageUri
          }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * __useGetOnlyThreadsQuery__
 *
 * To run a query within a React component, call `useGetOnlyThreadsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOnlyThreadsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOnlyThreadsQuery({
 *   variables: {
 *      feedinput: // value for 'feedinput'
 *   },
 * });
 */
export function useGetOnlyThreadsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetOnlyThreadsQuery,
    GetOnlyThreadsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetOnlyThreadsQuery, GetOnlyThreadsQueryVariables>(
    GetOnlyThreadsDocument,
    options
  );
}
export function useGetOnlyThreadsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetOnlyThreadsQuery,
    GetOnlyThreadsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetOnlyThreadsQuery, GetOnlyThreadsQueryVariables>(
    GetOnlyThreadsDocument,
    options
  );
}
export type GetOnlyThreadsQueryHookResult = ReturnType<
  typeof useGetOnlyThreadsQuery
>;
export type GetOnlyThreadsLazyQueryHookResult = ReturnType<
  typeof useGetOnlyThreadsLazyQuery
>;
export type GetOnlyThreadsQueryResult = Apollo.QueryResult<
  GetOnlyThreadsQuery,
  GetOnlyThreadsQueryVariables
>;
export const LoginDocument = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }
`;
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    options
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const MeDocument = gql`
  query Me {
    me {
      ...UserBase
    }
  }
  ${UserBaseFragmentDoc}
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
