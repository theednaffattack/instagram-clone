import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./type.field-error";
import { TokenData } from "./type.token-data";

@ObjectType()
export class LoginResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => TokenData, { nullable: true })
  tokenData?: TokenData;
}
