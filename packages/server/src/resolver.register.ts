import bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { configBuildAndValidate } from "./config.build-config";
import { User } from "./entity.user";
import { createConfirmationUrl } from "./lib.create-confirmation-url";
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
    let config;

    try {
      config = await configBuildAndValidate();
    } catch (error) {
      console.error(error);
      throw Error(error);
    }
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
      const userRepo = ctx.dbConnection.getRepository(User);

      user = userRepo.create({
        firstName,
        lastName,
        email,
        username,
        // count: 0,
        password: hashedPassword,
      });

      await userRepo.save(user);

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
      if (error.code && error.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "That username is reserved already, please try another.",
            },
          ],
        };
      }

      console.error("WHY ISN'T THIS RETURNING???");

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

    // If the code can execute this far registration is successful.
    // Send their confirmation email and return the user.
    await sendEmail(email, await createConfirmationUrl(user.id));
    return {
      user,
    };
  }
}
