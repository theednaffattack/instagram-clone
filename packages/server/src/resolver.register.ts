import bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "./entity.user";
import { createConfirmationUrl } from "./lib.create-confirmation-url";
import { handleAsyncWithArgs } from "./lib.handle-async";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";
import { hasOwnProperty } from "./lib.obj-has-own-property";
import { sendEmail } from "./lib.send-email";
import { RegisterInput } from "./type.register-input";
import { RegisterResponse } from "./type.register-response";
import { MyContext } from "./typings";

@Resolver()
export class RegisterResolver {
  @Mutation(() => RegisterResponse)
  async register(
    @Arg("data")
    { email, password, username, firstName, lastName }: RegisterInput,
    @Ctx() ctx: MyContext
  ): Promise<RegisterResponse> {
    if (username.length < 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Length must be greater than 2.",
          },
        ],
      };
    }
    if (password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "Length must be greater than 3.",
          },
        ],
      };
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
      // If it's an Error object or string, throw it.
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      if (typeof error === "string") {
        throw new Error(error);
      }
      // If the error is of an unknown type or shape
      // serialize and throw.
      throw new Error(JSON.stringify({ error }));
    }

    let user;
    try {
      const userRepo = ctx.dbConnection.getRepository(User);

      user = userRepo.create({
        firstName,
        lastName,
        email,
        username,
        // count: 0,
        password: hashedPassword,
      });

      try {
        await userRepo.save(user);
      } catch (error) {
        logger.error("Error saving User");
        logger.error({ error });
        return {
          errors: [
            {
              field: "username",
              message: "Unknown error, please try again.",
            },
          ],
        };
      }
      // If a User is not returned but it does not trigger
      // a database error, return an error.
      if (!user) {
        return {
          errors: [
            {
              field: "username",
              message: "That username is reserved already, please try another.",
            },
          ],
        };
      }
    } catch (error) {
      console.error("CATCH REGISTER ERROR", error);

      // Check for TypeOrm (or Postgres) error code "23505",
      // for duplicate keys.
      if (error && typeof error === "object" && hasOwnProperty(error, "code") && error.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "That username is reserved already, please try another.",
            },
          ],
        };
      }

      if (error && typeof error === "object" && hasOwnProperty(error, "message") && typeof error.message === "string")
        // If it is some other database retrieval error,
        // return the message to the user, for now.
        return {
          errors: [
            {
              field: "username",
              message: error.message,
            },
          ],
        };
    }

    if (!user) {
      return {
        errors: [{ field: "username", message: "Unkown error creating user. Please try again." }],
      };
    }

    const [confUrl, confUrlError] = await handleAsyncWithArgs(createConfirmationUrl, [user.id]);
    if (confUrlError) {
      handleCatchBlockError(confUrlError);
    }
    // If the code can execute this far registration is successful.
    // Send their confirmation email and return the user.
    const [, sendEmailError] = await handleAsyncWithArgs(sendEmail, [email, confUrl]);
    if (sendEmailError) {
      handleCatchBlockError(sendEmailError);
    }

    return {
      user,
    };
  }
}
