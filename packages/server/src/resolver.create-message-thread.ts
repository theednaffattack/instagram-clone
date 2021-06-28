import { Args, Resolver, Ctx, Mutation, UseMiddleware } from "type-graphql";
import { v4 } from "uuid";

import { MyContext } from "./typings";
import { isAuth } from "./middleware.is-auth";
import { AddMessageToThreadArgsInput } from "./gql-type.message-input";
import { Thread } from "./entity.thread";
import { Message } from "./entity.message";
import { User } from "./entity.user";
import { Image } from "./entity.image";

@Resolver()
export class CreateMessageThread {
  @UseMiddleware(isAuth)
  @Mutation(() => Thread)
  async createMessageThread(
    @Ctx() context: MyContext,
    @Args(() => AddMessageToThreadArgsInput)
    { images, invitees: inputInvittes, message, sentTo, threadId }: AddMessageToThreadArgsInput
  ) {
    const sentBy = await context.dbConnection.getRepository(User).findOne(context.userId);

    const collectInvitees: any[] = [];

    const invitees = await Promise.all(
      inputInvittes.map(async (person) => {
        let tempPerson = await context.dbConnection.getRepository(User).findOne(person);
        collectInvitees.push(tempPerson);
        return tempPerson;
      })
    );

    const receiver = await context.dbConnection.getRepository(User).findOne(sentTo);

    let newThread;

    const lastImage = images && images.length > 0 ? images.length - 1 : 0;

    // if we have the user sending and receiving and if there IS AN IMAGE(S)
    if (sentBy && receiver && images && images[lastImage] && invitees.length > 0) {
      // if there are images save them. if not make the message without it
      // const { filename } = await images[lastImage];

      let imageName = `${v4()}.png`;

      // let localImageUrl = `/../../../public/tmp/images/${imageName}`;

      let publicImageUrl = `https://eddie-faux-gram.s3.amazonaws.com/${imageName}`;

      // await new Promise((resolve, reject) => {
      //   createReadStream()
      //     .pipe(createWriteStream(__dirname + localImageUrl))
      //     .on("finish", () => {
      //       resolve(true);
      //     })
      //     .on("error", () => {
      //       reject(false);
      //     });
      // });

      let newImage = await context.dbConnection
        .getRepository(Image)
        .create({
          uri: publicImageUrl,
          //@ts-ignore
          user: sentBy,
        })
        .save();

      let createMessage = {
        message: message,
        user: receiver,
        sentBy,
        images: [newImage],
      };

      // CREATING rather than REPLYING to message...
      const newMessage = await context.dbConnection.getRepository(Message).create(createMessage).save();

      newImage.message = newMessage;

      let createThread = {
        user: sentBy,
        last_message: message,
        invitees: [sentBy, receiver, ...collectInvitees],
        messages: [newMessage],
      };

      newThread = await context.dbConnection
        .getRepository(Thread)
        .create(createThread)
        .save()
        .catch((error: any) => error);

      return newThread;
    }

    // if we have the user sending and receiving and if there IS NOT AN IMAGE
    if ((sentBy && receiver && !images) || !images![lastImage]) {
      let createMessage = {
        user: receiver,
        message: message,
        sentBy,
      };

      const newMessage = await context.dbConnection.getRepository(Message).create(createMessage).save();

      let createThread = {
        user: sentBy,
        last_message: message,
        invitees: [sentBy, receiver, ...collectInvitees],
        messages: [newMessage],
      };

      // @ts-ignore
      newThread = await context.dbConnection
        .getRepository(Thread)
        .create(createThread)
        .save()
        .catch((error: any) => error);

      return newThread;
    } else {
      throw Error(`unable to find sender or receiver\nsender: ${sentBy}\nreceiver: ${receiver}`);
    }
  }
}
