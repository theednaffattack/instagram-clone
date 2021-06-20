import * as React from "react";
import { Flex, Button } from "@chakra-ui/core";

import Camera from "./old-camera";
// import FauxCamera from "./faux-camera";
import { CameraAction, CameraStateType } from "../pages/post/new";

interface CameraModuleProps {
  cameraDispatch: React.Dispatch<CameraAction>;
  cameraState: CameraStateType;
}

export const CameraModule: React.FunctionComponent<CameraModuleProps> = ({
  cameraDispatch,
  cameraState
}) => {
  return (
    <Flex
      display={{ sm: "none", md: "none", lg: "flex", xl: "flex" }}
      flexDirection="column"
      height="100%"
      flex="1 1 auto"
      alignItems="center"
      textAlign="center"
      overflowX="hidden"
    >
      <Flex flexDirection="column">
        <Button
          type="button"
          colorScheme={
            cameraState.cameraStatus === "cameraIsOpen" ? "teal" : "blue"
          }
          onClick={() => {
            cameraDispatch({
              type:
                cameraState.cameraStatus === "cameraIsClosed"
                  ? "openCameraInit"
                  : "closeCamera"
            });

            if (cameraState.cameraStatus === "cameraIsOpen") {
              cameraDispatch({
                type: "clearCardImage"
              });
            }
          }}
        >
          {cameraState.cameraStatus === "cameraIsOpen"
            ? "close camera"
            : "open camera"}
        </Button>
      </Flex>
      <Flex height="100%" w="100%">
        {
          cameraState.cameraStatus === "cameraIsOpen" ? (
            <Camera cameraDispatch={cameraDispatch} cameraState={cameraState} />
          ) : null
          // <FauxCamera
          //   cameraDispatch={cameraDispatch}
          //   cameraState={cameraState}
          // />
        }
      </Flex>
    </Flex>
  );
};
