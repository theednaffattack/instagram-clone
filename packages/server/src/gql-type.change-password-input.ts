import { Field, InputType } from "type-graphql";

import { PasswordInput } from "./type.password-input";

@InputType()
export class ChangePasswordInput extends PasswordInput {
  @Field()
  token: string;
}
