import { Resolver, Query, Ctx, UseMiddleware, ObjectType, Field, Int, Arg, InputType } from "type-graphql";

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

import { PaginatedRelayThreadResponse } from "./gql-type.paginated-relay-response";
import { Thread } from "./entity.thread";
import { isAuth } from "./middleware.is-auth";
import { MyContext } from "./typings";

// we need to create a temporary class for the abstract, generic class "instance"
@ObjectType()
class ThreadConnection extends PaginatedRelayThreadResponse {
  // you can add more fields here if you need
}

@InputType()
class FeedInput {
  @Field(() => String, { nullable: true })
  cursor?: string;

  @Field(() => Int, { nullable: true })
  take?: number;
}

@Resolver()
export class GetOnlyThreads {
  @UseMiddleware(isAuth)
  @Query(() => ThreadConnection, { nullable: true })
  async getOnlyThreads(
    @Ctx() context: MyContext,
    @Arg("feedinput", () => FeedInput)
    feedinput: FeedInput
  ): Promise<ThreadConnection> {
    const formatDate = (date: any) => format(date, "yyyy-MM-dd HH:mm:ss");

    // export const MoreThanDate = (date: Date) => MoreThan(format(date, 'YYYY-MM-DD HH:MM:SS'))
    // export const LessThanDate = (date: Date) => LessThan(format(date, 'YYYY-MM-DD HH:MM:SS')

    const findThreads = await context.dbConnection
      .getRepository(Thread)
      .createQueryBuilder("thread")
      .loadRelationCountAndMap("thread.message_count", "thread.messages")
      .leftJoinAndSelect("thread.user", "user")
      .leftJoinAndSelect("thread.invitees", "inviteduser")
      .leftJoinAndSelect("thread.invitees", "invitee")
      .where("inviteduser.id = :id", { id: context.userId })
      .andWhere("thread.updated_at <= :cursor::timestamp", {
        cursor: formatDate(feedinput.cursor ? parseISO(feedinput.cursor) : new Date()),
      })
      // .orderBy("thread.updated_at", "DESC")
      .addOrderBy("thread.updated_at", "DESC")
      .take(feedinput.take)
      .getMany();

    // @TODO: This will have to be changed to hybrid data. Forcing an empty array
    // isn't enough information to handle very many cases
    // findThreads && findThreads.length > 0 ? findThreads : (findThreads = []);

    const threadsSelected = findThreads.reverse();

    // let newCursor;
    const newCursor =
      threadsSelected && threadsSelected.length > 0 && threadsSelected[0].updated_at
        ? threadsSelected[0].updated_at.toISOString()
        : new Date().toISOString();

    const startCursor = feedinput.cursor ? feedinput.cursor : new Date().toISOString();

    // BEFORE BOOLEAN
    const beforeThreads = await context.dbConnection
      .getRepository(Thread)
      .createQueryBuilder("thread")
      .leftJoinAndSelect("thread.invitees", "inviteduser")
      .leftJoinAndSelect("thread.invitees", "invitee")
      .where("inviteduser.id = :id", { id: context.userId })
      .andWhere("thread.updated_at <= :cursor::timestamp", {
        cursor: formatDate(parseISO(newCursor)),
      })
      // .orderBy("thread.updated_at", "DESC")
      .addOrderBy("thread.updated_at", "DESC")
      .take(feedinput.take)
      .getMany();

    // AFTER  BOOLEAN
    const afterThreads = await context.dbConnection
      .getRepository(Thread)
      .createQueryBuilder("thread")
      .leftJoinAndSelect("thread.invitees", "inviteduser")
      .leftJoinAndSelect("thread.invitees", "invitee")
      .where("inviteduser.id = :id", { id: context.userId })
      .andWhere("thread.updated_at >= :cursor::timestamp", {
        cursor: formatDate(parseISO(startCursor)),
      })
      // .orderBy("thread.updated_at", "DESC")
      .addOrderBy("thread.updated_at", "DESC")
      .take(feedinput.take)
      .getMany();

    const myThreadEdges =
      threadsSelected && threadsSelected.length > 0
        ? threadsSelected.map((thread) => {
            return {
              node: thread,
            };
          })
        : [];

    const response = {
      edges: myThreadEdges,
      pageInfo: {
        startCursor: startCursor,
        endCursor: newCursor,
        hasNextPage: afterThreads.length > 0,
        hasPreviousPage: beforeThreads.length > 0,
      },
    };
    return response;
  }
}
