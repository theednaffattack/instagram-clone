import { ObjectType, Field } from "type-graphql";

import { FieldError } from "./field-error";
import { User } from "./entity.user";

@ObjectType()
export class LoginResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
