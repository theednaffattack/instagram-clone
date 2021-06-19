import { Stream } from "stream";
import { Field, ObjectType } from "type-graphql";

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

@ObjectType()
export class UploadType {
  @Field()
  filename: string;

  @Field()
  encoding: string;

  @Field()
  mimetype: string;

  // @Field()
  // createReadStream
}
