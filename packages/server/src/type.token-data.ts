import { ObjectType, Field, ID, Int } from "type-graphql";

@ObjectType()
export class TokenData {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => Date, { nullable: true })
  expiresIn?: Date;

  @Field(() => ID, { nullable: true })
  userId?: string;

  @Field(() => Int, { nullable: true })
  version?: number;
}
