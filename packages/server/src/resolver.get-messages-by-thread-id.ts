import {
  Resolver,
  Query,
  UseMiddleware,
  Arg,
  InputType,
  Field,
  Int,
  Subscription,
  ObjectType,
  Ctx,
} from "type-graphql";

import { format, parseISO } from "date-fns";

import { Message } from "./entity.message";
import { GetMessagesByThreadIdInput } from "./gql-type.get-message-by-thread-id-input";
import { PaginatedRelayMessageResponse } from "./gql-type.paginated-relay-response";
import { isAuth } from "./middleware.is-auth";
import { AddMessagePayload } from "./resolver.add-message-to-thread";
import { MyContext } from "./typings";

const formatDate = (date: any) => format(date, "yyyy-MM-dd HH:mm:ss");

@ObjectType()
class MessageConnection extends PaginatedRelayMessageResponse {
  // you can add more fields here if you need
}

@Resolver()
export class GetMessagesByThreadId {
  @UseMiddleware(isAuth)
  @Query(() => MessageConnection, { nullable: true })
  @Subscription(() => AddMessagePayload, {
    topics: "THREADS",
    filter: ({ args, payload }) => {
      const messageMatchesThread = args.data.threadId === payload.threadId;

      if (messageMatchesThread) {
        return true;
      } else {
        return false;
      }
    },
  })
  async getMessagesByThreadId(
    @Arg("input", () => GetMessagesByThreadIdInput)
    input: GetMessagesByThreadIdInput,
    @Ctx() ctx: MyContext
  ): Promise<MessageConnection> {
    const qThreads = await ctx.dbConnection
      .getRepository(Message)
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.user", "user")
      .leftJoinAndSelect("message.sentBy", "sentBy")
      .leftJoinAndSelect("message.images", "image")
      .leftJoinAndSelect("message.thread", "thread")
      .where("thread.id = :id", { id: input.threadId })
      .andWhere("message.created_at <= :cursor::timestamp", {
        cursor: formatDate(input.cursor ? parseISO(input.cursor) : new Date()),
      })
      .orderBy("message.created_at", "DESC")
      .take(input.take)
      .getMany();

    const flippedMessages = qThreads.reverse();

    const startCursor = input.cursor ? input.cursor : new Date().toISOString();

    const cursorNoRecordsErrorMessage = "no 'created_at' record present to create new cursor";

    const newCursor =
      flippedMessages[0] && flippedMessages[0].created_at
        ? flippedMessages[0].created_at.toISOString()
        : cursorNoRecordsErrorMessage;

    const beforeMessages =
      newCursor === cursorNoRecordsErrorMessage
        ? false
        : await ctx.dbConnection
            .getRepository(Message)
            .createQueryBuilder("message")
            .leftJoinAndSelect("message.user", "user")
            .leftJoinAndSelect("message.sentBy", "sentBy")
            .leftJoinAndSelect("message.images", "image")
            .leftJoinAndSelect("message.thread", "thread")
            // .where("user.id = :user_id", { user_id: context.userId })
            .where("thread.id = :id", { id: input.threadId })
            .andWhere("message.created_at <= :cursor::timestamp", {
              cursor: formatDate(parseISO(newCursor)),
            })
            .orderBy("message.created_at", "DESC")
            .take(input.take)
            .getMany();

    const afterMessages = await ctx.dbConnection
      .getRepository(Message)
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.user", "user")
      .leftJoinAndSelect("message.sentBy", "sentBy")
      .leftJoinAndSelect("message.images", "image")
      .leftJoinAndSelect("message.thread", "thread")
      .where("thread.id = :id", { id: input.threadId })
      .andWhere("message.created_at >= :cursor::timestamp", {
        cursor: formatDate(input.cursor ? parseISO(startCursor) : new Date()),
      })
      .orderBy("message.created_at", "DESC")
      .take(input.take)
      .getMany();

    let response: MessageConnection = {
      edges: flippedMessages.map((message) => {
        return { cursor: message.created_at.toISOString(), node: message };
      }),
      pageInfo: {
        startCursor,
        endCursor: newCursor,
        hasNextPage: afterMessages.length > 0 ? true : false,
        hasPreviousPage: beforeMessages && beforeMessages.length > 0 ? true : false,
      },
    };

    return response;
  }
}
