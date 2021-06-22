import { ObjectType, Field } from "type-graphql";
import { User } from "./entity.user";
import { FieldError } from "./type.field-error";

@ObjectType()
export class UserResponse {
  @Field(() => FieldError, { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
