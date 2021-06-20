import React, { useState, useRef, useEffect } from "react";
import Measure, { ContentRect } from "react-measure";
import { disableBodyScroll } from "body-scroll-lock";
import { Button, Flex } from "@chakra-ui/core";

import styles from "../components/camera.module.css";

import { useOffsets, useCardRatio, useUserMedia } from "../lib/custom-hooks";
import { CameraAction, CameraStateType } from "../pages/post/new";

export interface SizeRect {
  readonly width: number;
  readonly height: number;
}

const CAPTURE_OPTIONS: MediaStreamConstraints = {
  audio: false,
  video: { facingMode: "environment" }
};

interface CameraProps {
  cameraDispatch: React.Dispatch<CameraAction>;
  cameraState: CameraStateType;
}

const Camera: React.FunctionComponent<CameraProps> = ({ cameraDispatch }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const [container, setContainer] = useState({ width: 0, height: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const [, setIsFlashing] = useState(false);

  const mediaStream = useUserMedia(CAPTURE_OPTIONS);
  const [aspectRatio, calculateRatio] = useCardRatio(1.586);

  let videoWidth = 0;
  let videoHeight = 0;

  useEffect(() => {
    if (listContainerRef && listContainerRef.current)
      disableBodyScroll(listContainerRef.current);
  }, []);

  if (videoRef.current && videoRef.current.videoWidth) {
    videoWidth = videoRef.current.videoWidth;
  }

  if (videoRef.current && videoRef.current.videoHeight) {
    videoHeight = videoRef.current.videoHeight;
  }

  const offsets = useOffsets(
    videoWidth,
    videoHeight,
    container.width,
    container.height
  );

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  function handleResize(contentRect: ContentRect) {
    if (contentRect && contentRect.bounds && typeof aspectRatio === "number") {
      setContainer({
        width: contentRect.bounds.width,
        height: Math.round(contentRect.bounds.width / aspectRatio)
      });
    } else {
      const contentRectError = "Error! contentRect is undefined";
      const boundsError = "Error! contentRect.bounds is undefined";
      const aspectRatioTypeError = "Error! aspectRatio is not a number";
      if (typeof aspectRatio !== "number") {
        throw Error(aspectRatioTypeError);
      }
      if (!contentRect) {
        throw Error(contentRectError);
      }

      if (contentRect && !contentRect.bounds) {
        throw Error(boundsError);
      }
    }
  }

  function handleCanPlay() {
    calculateRatio(videoHeight, videoWidth);
    setIsVideoPlaying(true);
    videoRef.current && videoRef.current.play();
  }

  /** See MDN REference:
   * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage */
  type CanvasContextProp = CanvasRenderingContext2D;

  function handleCapture() {
    const get2dContext =
      canvasRef.current && canvasRef.current.getContext("2d");
    /** Canvas element context */
    let context: CanvasContextProp;

    if (canvasRef && canvasRef.current && get2dContext && videoRef.current) {
      context = get2dContext;

      context.drawImage(
        videoRef.current,
        offsets.x,
        offsets.y,
        container.width,
        container.height,
        0,
        0,
        container.width,
        container.height
      );

      canvasRef.current.toBlob(
        (blob: Blob | null) => {
          if (blob) {
            cameraDispatch({ type: "setCardImage", payload: blob });
          } else {
            throw Error(
              "Error setting card image. Canvas ref is either null or has no value."
            );
          }
        },
        "image/png",
        1
      );
      setIsCanvasEmpty(false);
      setIsFlashing(true);
    }
  }

  function handleClear() {
    const get2dContext =
      canvasRef.current && canvasRef.current.getContext("2d");
    /** Canvas element context */
    let context: CanvasContextProp;
    if (canvasRef && canvasRef.current && get2dContext && videoRef.current) {
      context = get2dContext;

      context.clearRect(0, 0, videoWidth, videoHeight);
      setIsCanvasEmpty(true);
      cameraDispatch({ type: "clearCardImage" });
    } else {
      const errorObj = {
        canvasRefError:
          !canvasRef.current &&
          "No canvas ref is set (cannot access the canvas DOM node).",
        contextError: !get2dContext && "Cannot retrieve the canvas context",
        videoRefError:
          !videoRef.current &&
          "No video ref is set (cannot access the video DOM node)"
      };
      throw Error(`${JSON.stringify(errorObj)}`);
    }
  }

  if (!mediaStream) {
    return null;
  }

  return (
    <>
      <Flex
        flexDirection="column"
        alignItems="center"
        // justifyContent="center"
        width="100%"
        flex="1 1 auto"
        ref={listContainerRef}
        overflowY="scroll"
        style={{
          height: "100%",
          // overflowY: "scroll",
          WebkitOverflowScrolling: "touch"
        }}
      >
        <Measure bounds onResize={handleResize}>
          {({ measureRef }) => (
            <Flex
              flexDirection="column"
              alignItems="center"
              // justifyContent="center"
              height="100%"
              width="100%"
              flex="1 1 auto"
              ref={measureRef} // {listContainerRef}
              // style={{
              //   // height: "100%",
              //   // overflowY: "scroll",
              //   // WebkitOverflowScrolling: "touch"
              // }}
            >
              <Flex
                alignItems="center"
                justifyContent="center"
                width="100%"
                flexDirection="column"
                height="100%"
                px={3}
                style={{
                  position: "relative",
                  // overflowY: "scroll",
                  maxHeight: container.height,
                  overflow: "hidden"
                }}
              >
                <div
                  className={styles.container}
                  ref={measureRef}
                  style={{
                    height: "100%",
                    // height: `${videoHeight}px`,
                    maxHeight: videoHeight,
                    width: `${videoWidth}px`
                  }}
                >
                  <video
                    className={styles.video}
                    ref={videoRef}
                    hidden={!isVideoPlaying}
                    onCanPlay={handleCanPlay}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      top: `-${offsets.y}px`,
                      left: `-${offsets.x}px`
                      // right: 0,
                      // bottom: 0
                    }}
                  />

                  <div className={styles.overaly} hidden={!isVideoPlaying} />

                  <canvas
                    className={styles.canvas}
                    ref={canvasRef}
                    width={container.width}
                    height={videoHeight}
                  />
                </div>
              </Flex>

              <Flex
                alignItems="center"
                width={[1, 1, 1, `${videoWidth}px`]}
                flexDirection="column"
                px={3}
                pt={3}
              >
                {isVideoPlaying && (
                  <Button
                    // mt={3}
                    // mb={3}
                    // ml={-2}
                    colorScheme="teal"
                    type="button"
                    onClick={isCanvasEmpty ? handleCapture : handleClear}
                  >
                    {isCanvasEmpty ? "take a picture" : "clear"}
                  </Button>
                )}
              </Flex>
            </Flex>
          )}
        </Measure>
        <div>foot spacer</div>
      </Flex>
    </>
  );
};

export default Camera;
