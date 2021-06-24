import { Args, Resolver, Mutation, ObjectType, ArgsType, Field, InputType, Int, Float } from "type-graphql";
import aws from "aws-sdk";
import { configBuildAndValidate } from "./config.build-config";
import { File } from "aws-sdk/lib/dynamodb/document_client";

@InputType()
class ImageSubInput {
  @Field(() => Float, { nullable: false })
  lastModified: number;

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => Int, { nullable: false })
  size: number;

  @Field(() => String, { nullable: false })
  type: string;
}

@ArgsType()
class SignS3Input {
  @Field(() => [ImageSubInput])
  files: ImageSubInput[];
}

@ObjectType()
class SignedS3SubPayload {
  @Field(() => String)
  url: string;

  @Field(() => String)
  signedRequest: string;
}

@ObjectType()
class SignedS3Payload {
  @Field(() => [SignedS3SubPayload])
  signatures: SignedS3SubPayload[];
}
// const USER_ADDED = "USER_ADDED";

// const formatErrors = (e, models) => {
//   if (e instanceof models.sequelize.ValidationError) {
//     return e.errors.map(x => _.pick(x, ["path", "message"]));
//   }
//   return [{ path: "name", message: "something went wrong" }];
// };

@Resolver()
export class SignS3 {
  @Mutation(() => SignedS3Payload)
  async signS3(@Args(() => SignS3Input) input: SignS3Input): Promise<SignedS3Payload> {
    console.log("SIGN S3 CHECK");

    const configBuilt = await configBuildAndValidate();

    const config = configBuilt.getProperties();

    const credentials = {
      accessKeyId: config.awsConfig.awsAccessKeyId,
      secretAccessKey: config.awsConfig.awsSecretAccessKey,
    };

    console.log("VIEW CREDENTIALS", credentials, {
      bucket: process.env.S3_BUCKET,
      accKey: process.env.AWS_ACCESS_KEY_ID,
      secKey: process.env.AWS_SECRET_KEY,
    });

    aws.config.update(credentials);

    const s3 = new aws.S3({
      signatureVersion: "v4",
      region: "us-west-2",
    });

    const s3Params = input.files.map((file) => {
      return {
        Bucket: config.awsConfig.s3Bucket,
        Key: `images/${file.name}`,
        Expires: 60,
        ContentType: file.type,
        // ACL: "public-read"
      };
    });

    // const signedRequests = await Promise.all(
    //   s3Params.map((param) => {
    //     let signedRequest = s3.getSignedUrl("putObject", param);
    //     const url = `https://${config.awsConfig.s3Bucket}.s3.amazonaws.com/${param.Key}`;

    //     return { url, signedRequest };
    //   })
    // );

    const signedStuff = s3Params.map((param) => {
      let signedRequest = s3.getSignedUrl("putObject", param);
      const url = `https://${config.awsConfig.s3Bucket}.s3.amazonaws.com/${param.Key}`;

      return { url, signedRequest };
    });

    console.log("VIEW SIGNED STUFF", signedStuff);

    return {
      signatures: [...signedStuff],
    };
  }
}
