import bcrypt from "bcryptjs";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { User } from "./entity.user";
import { createConfirmationUrl } from "./lib.create-confirmation-url";
import { sendEmail } from "./lib.send-email";
import { Logger as logger } from "./middleware.logger";
import { RegisterInput } from "./type.register-input";
import { RegisterResponse } from "./type.register-response";

@Resolver()
export class RegisterResolver {
  @UseMiddleware(logger)
  @Query(() => String, { name: "helloWorld", nullable: false })
  async hello() {
    return "Hello World";
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Arg("data")
    { email, password, username, firstName, lastName }: RegisterInput
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

    const hashedPassword = await bcrypt.hash(password, 12);
    let user;
    try {
      user = await User.create({
        firstName,
        lastName,
        // email,
        username,
        // count: 0,
        password: hashedPassword,
      }).save();

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
      // Check for TypeOrm (or Postgres) error code "23505",
      // for duplicate keys.
      if (error.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "That username is reserved already, please try another.",
            },
          ],
        };
      }
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

    // If the code can execute this far registration is successful.
    // Send their confirmation email and return the user.
    await sendEmail(email, await createConfirmationUrl(user.id));
    return {
      user,
    };
  }
}
