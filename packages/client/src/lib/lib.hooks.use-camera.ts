import { useReducer } from "react";
import { Dispatch } from "react";

export interface CameraStateType {
  cameraStatus: "cameraIsOpen" | "cameraIsClosed";
  cardImage: Blob | null;
}

export type CameraAction =
  | { type: "openCameraInit" }
  | { type: "closeCamera" }
  | { type: "clearCardImage" }
  | { type: "setCardImage"; payload: Blob };

const initialCameraState: CameraStateType = {
  cameraStatus: "cameraIsClosed",
  cardImage: null,
};

function initCamera(theInitialCameraState: CameraStateType): CameraStateType {
  return {
    cameraStatus: theInitialCameraState.cameraStatus,
    cardImage: theInitialCameraState.cardImage,
  };
}

function cameraReducer(
  state: CameraStateType,
  action: CameraAction
): CameraStateType {
  switch (action.type) {
    case "openCameraInit":
      return {
        cameraStatus: "cameraIsOpen",
        cardImage: null,
      };

    case "closeCamera":
      return {
        cameraStatus: "cameraIsClosed",
        cardImage: null,
      };

    case "clearCardImage":
      return {
        cameraStatus: state.cameraStatus,
        cardImage: null,
      };

    case "setCardImage":
      return {
        cameraStatus: state.cameraStatus,
        cardImage: action.payload,
      };

    default:
      return initialCameraState;
  }
}

export function useCamera(): [CameraStateType, Dispatch<CameraAction>] {
  const [cameraState, cameraDispatch] = useReducer(
    cameraReducer,
    initialCameraState,
    initCamera
  );
  return [cameraState, cameraDispatch];
}
