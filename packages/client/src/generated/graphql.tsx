import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
  fileType: FileTypeEnum;
  message?: Maybe<Message>;
  uploadUser: User;
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
  tokenData?: Maybe<TokenData>;
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
  bye: Scalars["String"];
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

export type TokenData = {
  __typename?: "TokenData";
  accessToken?: Maybe<Scalars["String"]>;
  expiresIn?: Maybe<Scalars["DateTime"]>;
  userId?: Maybe<Scalars["ID"]>;
  version?: Maybe<Scalars["Int"]>;
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
      | "id"
      | "title"
      | "text"
      | "comments_count"
      | "currently_liked"
      | "date_formatted"
      | "likes_count"
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
  password: Scalars["String"];
  username: Scalars["String"];
}>;

export type LoginMutation = { __typename?: "Mutation" } & {
  login: { __typename?: "LoginResponse" } & {
    errors?: Maybe<
      Array<
        { __typename?: "FieldError" } & Pick<FieldError, "field" | "message">
      >
    >;
    tokenData?: Maybe<
      { __typename?: "TokenData" } & Pick<
        TokenData,
        "accessToken" | "expiresIn" | "userId" | "version"
      >
    >;
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

export function useAddMessageToThreadMutation() {
  return Urql.useMutation<
    AddMessageToThreadMutation,
    AddMessageToThreadMutationVariables
  >(AddMessageToThreadDocument);
}
export const ChangePasswordDocument = gql`
  mutation ChangePassword($data: ChangePasswordInput!) {
    changePassword(data: $data) {
      ...TypicalUserResponse
    }
  }
  ${TypicalUserResponseFragmentDoc}
`;

export function useChangePasswordMutation() {
  return Urql.useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(ChangePasswordDocument);
}
export const ConfirmUserDocument = gql`
  mutation ConfirmUser($token: String!) {
    confirmUser(token: $token)
  }
`;

export function useConfirmUserMutation() {
  return Urql.useMutation<ConfirmUserMutation, ConfirmUserMutationVariables>(
    ConfirmUserDocument
  );
}
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

export function useCreateMessageThreadMutation() {
  return Urql.useMutation<
    CreateMessageThreadMutation,
    CreateMessageThreadMutationVariables
  >(CreateMessageThreadDocument);
}
export const CreateOrUpdateLikesDocument = gql`
  mutation CreateOrUpdateLikes($input: UpdateLikesInput!) {
    createOrUpdateLikes(input: $input) {
      postId
      status
    }
  }
`;

export function useCreateOrUpdateLikesMutation() {
  return Urql.useMutation<
    CreateOrUpdateLikesMutation,
    CreateOrUpdateLikesMutationVariables
  >(CreateOrUpdateLikesDocument);
}
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

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(
    CreatePostDocument
  );
}
export const ForgotPasswordDocument = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export function useForgotPasswordMutation() {
  return Urql.useMutation<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >(ForgotPasswordDocument);
}
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;

type LogoutReturn = Urql.UseMutationResponse<
  LogoutMutation,
  Exact<{
    [key: string]: never;
  }>
>;

export function useLogoutMutation(): LogoutReturn {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument
  );
}
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

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument
  );
}
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

export function useSignS3Mutation() {
  return Urql.useMutation<SignS3Mutation, SignS3MutationVariables>(
    SignS3Document
  );
}
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
      comments_count
      currently_liked
      date_formatted
      likes_count
    }
  }
`;

export function useGetGlobalPostByIdQuery(
  options: Omit<
    Urql.UseQueryArgs<GetGlobalPostByIdQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<GetGlobalPostByIdQuery>({
    query: GetGlobalPostByIdDocument,
    ...options,
  });
}
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

export function useGetGlobalPostsRelayQuery(
  options: Omit<
    Urql.UseQueryArgs<GetGlobalPostsRelayQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<GetGlobalPostsRelayQuery>({
    query: GetGlobalPostsRelayDocument,
    ...options,
  });
}
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

export function useGetGlobalPostsSimplePaginationQuery(
  options: Omit<
    Urql.UseQueryArgs<GetGlobalPostsSimplePaginationQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<GetGlobalPostsSimplePaginationQuery>({
    query: GetGlobalPostsSimplePaginationDocument,
    ...options,
  });
}
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

export function useGetGlobalPostsQuery(
  options: Omit<Urql.UseQueryArgs<GetGlobalPostsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<GetGlobalPostsQuery>({
    query: GetGlobalPostsDocument,
    ...options,
  });
}
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

export function useGetListToCreateThreadQuery(
  options: Omit<
    Urql.UseQueryArgs<GetListToCreateThreadQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<GetListToCreateThreadQuery>({
    query: GetListToCreateThreadDocument,
    ...options,
  });
}
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

export function useGetMessagesByThreadIdQuery(
  options: Omit<
    Urql.UseQueryArgs<GetMessagesByThreadIdQueryVariables>,
    "query"
  > = {}
) {
  return Urql.useQuery<GetMessagesByThreadIdQuery>({
    query: GetMessagesByThreadIdDocument,
    ...options,
  });
}
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

export function useGetOnlyThreadsQuery(
  options: Omit<Urql.UseQueryArgs<GetOnlyThreadsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<GetOnlyThreadsQuery>({
    query: GetOnlyThreadsDocument,
    ...options,
  });
}
export const LoginDocument = gql`
  mutation Login($password: String!, $username: String!) {
    login(password: $password, username: $username) {
      errors {
        field
        message
      }
      tokenData {
        accessToken
        expiresIn
        userId
        version
      }
    }
  }
`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
}
export const MeDocument = gql`
  query Me {
    me {
      ...UserBase
    }
  }
  ${UserBaseFragmentDoc}
`;

export function useMeQuery(
  options: Omit<Urql.UseQueryArgs<MeQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
}
