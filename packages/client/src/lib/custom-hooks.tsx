import * as React from "react";
import {
  GlobalPostReturnType,
  Image,
  Like,
  Maybe,
  PostEdge,
  User
} from "../generated/graphql";
import { isServer } from "./utilities.is-server";

export type PossibleMediaStream = null | MediaStream;

type PostEdgeSubstitute =
  | Array<
      { __typename?: "PostEdge" } & Pick<PostEdge, "cursor"> & {
          node: { __typename?: "GlobalPostReturnType" } & Pick<
            GlobalPostReturnType,
            | "id"
            | "title"
            | "text"
            | "likes_count"
            | "comments_count"
            | "currently_liked"
            | "created_at"
          > & {
              user?: Maybe<
                { __typename?: "User" } & Pick<
                  User,
                  "id" | "username" | "profileImgUrl"
                >
              >;
              images?: Maybe<
                Array<{ __typename?: "Image" } & Pick<Image, "id" | "uri">>
              >;
              likes?: Maybe<Array<{ __typename?: "Like" } & Pick<Like, "id">>>;
            };
        }
    >
  | undefined;

// imported from:
// https://www.smashingmagazine.com/2020/03/infinite-scroll-lazy-image-loading-react/
// https://github.com/chidimo/React-Infinite-Scroll-and-Lazy-Loading/blob/master/src/customHooks.js
export function useInfiniteScroll(
  scrollRef: React.MutableRefObject<HTMLDivElement | null>,
  setInfState: React.Dispatch<React.SetStateAction<"idle" | "fetch-more">>
) {
  const scrollObserver = React.useCallback(
    (node) => {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.intersectionRatio > 0) {
            setInfState("fetch-more");
            // dispatch({ type: "ADVANCE_PAGE" });
          }
        });
      }).observe(node);
    },
    [setInfState]
  );
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollObserver(scrollRef.current);
    }
  }, [scrollObserver, scrollRef]);
}

// lazy load images with intersection observer
export const useLazyLoading = (
  imgSelector: string,
  items: PostEdgeSubstitute
) => {
  const imgObserver = React.useCallback((node: HTMLImageElement) => {
    const intObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.intersectionRatio > 0) {
          const currentImg = en.target as HTMLImageElement;

          const newImgSrc = currentImg.dataset.srcset;

          // only swap out the image source if the new url exists
          if (!newImgSrc) {
            console.error("Image source is invalid");
          } else {
            currentImg.srcset = newImgSrc;
          }
          intObs.unobserve(node);
        }
      });
    });
    intObs.observe(node);
  }, []);

  const imagesRef = React.useRef<NodeListOf<HTMLImageElement> | null>(null);

  React.useEffect(() => {
    imagesRef.current = document.querySelectorAll(imgSelector);

    if (imagesRef.current) {
      imagesRef.current.forEach((img) => imgObserver(img));
    }
  }, [imgObserver, imagesRef, imgSelector, items]);
};

/**
 * Since the camera container resembles a licence card, the height must always be less than the
 * width (regardless of the resolution of the camera). This is achieved by calculating a ratio
 * that is always >= 1 by dividing by the largest dimension.
 **/
export function useCardRatio(initialParams: any) {
  const [aspectRatio, setAspectRatio] = React.useState(initialParams);

  const calculateRatio = React.useCallback((height: number, width: number) => {
    if (height && width) {
      const isLandscape = height <= width;
      const ratio = isLandscape ? width / height : height / width;

      setAspectRatio(ratio);
    }
  }, []);

  return [aspectRatio, calculateRatio];
}

export function useUserMedia(requestedMedia: MediaStreamConstraints) {
  const [mediaStream, setMediaStream] = React.useState<PossibleMediaStream>(
    null
  );

  React.useEffect(() => {
    async function enableVideoStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          requestedMedia
        );
        setMediaStream(stream);
      } catch (err) {
        // Handle the error
        console.warn("Error accessing navigator.mediaDevices", {
          err,
          navigator
        });
      }
    }

    if (!mediaStream && !isServer()) {
      enableVideoStream();
    } else {
      return function cleanup() {
        mediaStream?.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [mediaStream, requestedMedia]);

  return mediaStream;
}

/**
 * In the event that the video (v) is larger than it's parent container (c), calculate offsets
 * to center the container in the middle of the video.
 **/
export function useOffsets(
  vWidth: number,
  vHeight: number,
  cWidth: number,
  cHeight: number
) {
  const [offsets, setOffsets] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (vWidth && vHeight && cWidth && cHeight) {
      const x = vWidth > cWidth ? Math.round((vWidth - cWidth) / 2) : 0;
      const y = vHeight > cHeight ? Math.round((vHeight - cHeight) / 2) : 0;

      setOffsets({ x, y });
    }
  }, [vWidth, vHeight, cWidth, cHeight]);

  return offsets;
}
