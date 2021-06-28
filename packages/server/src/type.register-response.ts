import { ObjectType, Field } from "type-graphql";

import { FieldError } from "./type.field-error";
import { User } from "./entity.user";

@ObjectType()
export class RegisterResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
