import { ID, Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID, { nullable: true })
  id!: string;

  @Field(() => String, { nullable: true })
  firstName!: string;

  @Field(() => String, { nullable: true })
  lastName!: string;

  @Field(() => String, { nullable: true })
  username!: string;

  @Field(() => String, { nullable: true })
  email!: string;

  @Field(() => String, { nullable: true })
  confirmed!: boolean;

  password!: string;
}
