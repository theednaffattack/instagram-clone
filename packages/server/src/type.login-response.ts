import { ObjectType, Field, ID, Int } from "type-graphql";

import { FieldError } from "./type.field-error";
import { User } from "./entity.user";

@ObjectType()
export class LoginResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => Date, { nullable: true })
  expiresIn?: Date;

  @Field(() => ID, { nullable: true })
  userId?: string;

  @Field(() => Int, { nullable: true })
  version?: number;
}
