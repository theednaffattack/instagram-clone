import { Min, Max } from "class-validator";
import { InputType, Field, Int } from "type-graphql";

@InputType()
export class GetMessagesByThreadIdInput {
  @Field(() => String, { nullable: true })
  cursor?: string;

  @Field(() => String)
  threadId: string;

  @Field(() => Int, { defaultValue: 0, nullable: true })
  @Min(0)
  skip?: number;

  @Field(() => Int, { defaultValue: 15, nullable: true })
  @Min(1)
  @Max(25)
  take?: number;

  // // helpers - index calculations
  // startIndex = this.skip;
  // endIndex = this.skip + this.take;
}
