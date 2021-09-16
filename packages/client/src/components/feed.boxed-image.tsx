import { Box } from "@chakra-ui/react";
import { Image as ImageType } from "../generated/graphql";

interface FeedBoxedImageProps {
  images: ({
    __typename?: "Image";
  } & Pick<ImageType, "id" | "uri">)[];
  imageLoadState: "isLoaded" | "isLoading" | "isError" | "init";
  setImageLoadState: React.Dispatch<
    React.SetStateAction<"isLoaded" | "isLoading" | "isError" | "init">
  >;
}

export function FeedBoxedImage({
  images,
  imageLoadState,
  setImageLoadState,
}: FeedBoxedImageProps): JSX.Element {
  return (
    <Box>
      {images && images[0] ? (
        <>
          <img
            alt={images[0].__typename + "-" + images[0].id}
            key={images[0].id}
            src={images[0].uri}
            object-fit="cover"
            onLoad={(evt: React.SyntheticEvent<HTMLImageElement, Event>) => {
              evt.preventDefault();
              handleImageLoaded(setImageLoadState);
            }}
            onError={() => {
              setImageLoadState("isError");
            }}
            style={
              imageLoadState === "isLoaded" ? undefined : { display: "none" }
            }
          />
          {imageLoadState !== "isLoaded" ? (
            <img
              alt={`${images[0].id}-alt`}
              key={`${images[0].id}-placeholder`}
              width="100%"
              object-fit="cover"
              src="https://via.placeholder.com/800"
            />
          ) : null}
        </>
      ) : (
        <img src="https://via.placeholder.com/800" />
      )}
    </Box>
  );
}

function handleImageLoaded(
  dispatch: React.Dispatch<
    React.SetStateAction<"isLoaded" | "isLoading" | "isError" | "init">
  >
) {
  dispatch("isLoaded");
}
