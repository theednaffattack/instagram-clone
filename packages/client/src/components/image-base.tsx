import { Image } from "@chakra-ui/core";
import React from "react";
import { Maybe, Image as ImageType } from "../generated/graphql";

interface ImageBaseProps {
  images:
    | Maybe<Array<{ __typename?: "Image" } & Pick<ImageType, "id" | "uri">>>
    | null
    | undefined;
}

export const ImageBase: React.FC<ImageBaseProps> = ({ images }) => {
  if (images && images.length > 0) {
    return (
      <Image
        src={images[0].uri}
        fallbackSrc="https://via.placeholder.com/150"
      />
    );
  }
  return <Image src="https://via.placeholder.com/150" />;
};
