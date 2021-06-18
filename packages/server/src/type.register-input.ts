import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";

import { DoesEmailAlreadyExist } from "./lib.check-existing-email";
import { PasswordInput } from "./type.password-input";

@InputType()
export class RegisterInput extends PasswordInput {
  @Field({ nullable: true })
  @Length(1, 30)
  firstName?: string;

  @Field({ nullable: true })
  @Length(1, 30)
  lastName?: string;

  @Field()
  @Length(3, 25)
  username: string;

  @Field()
  @IsEmail()
  @DoesEmailAlreadyExist({ message: "email already in use" })
  email: string;
}
