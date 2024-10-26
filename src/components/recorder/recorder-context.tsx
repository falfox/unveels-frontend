// recorder-context.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CameraState {
  facePosition: boolean;
  lighting: boolean;
  orientation: boolean;
  flipped: boolean;
  isFinished: boolean;
  isCaptured: boolean;
  capturedImage: string | null;
  capturedImageCut: string | null;
  isCompare: boolean;
  lastBoundingBox: BoundingBox | null;
}

interface CameraContextType {
  criterias: CameraState;
  setCriterias: (newState: Partial<CameraState>) => void;
  flipCamera: () => void;
  finish: () => void;
  captureImage: (image: string) => void;
  captureImageCut: (image: string) => void;
  compareCapture: () => void;
  resetCapture: () => void;
  setBoundingBox: (box: BoundingBox) => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<CameraState>({
    facePosition: false,
    lighting: false,
    orientation: false,
    flipped: false,
    isFinished: false,
    isCaptured: false,
    capturedImage: null,
    capturedImageCut: null,
    isCompare: false,
    lastBoundingBox: null,
  });

  function setCriterias(newState: Partial<CameraState>) {
    setState((prevState) => ({ ...prevState, ...newState }));
  }

  function flipCamera() {
    setState((prevState) => ({ ...prevState, flipped: !prevState.flipped }));
  }

  function finish() {
    setState((prevState) => ({ ...prevState, isFinished: true }));
  }

  function captureImage(image: string) {
    setState((prevState) => ({
      ...prevState,
      isCaptured: true,
      capturedImage: image,
    }));
  }

  function captureImageCut(image: string) {
    setState((prevState) => ({
      ...prevState,
      isCaptured: true,
      capturedImageCut: image,
    }));
  }

  function compareCapture() {
    setState((prevState) => ({
      ...prevState,
      isCompare: !state.isCompare,
    }));
  }

  function resetCapture() {
    setState((prevState) => ({
      ...prevState,
      isCaptured: false,
      capturedImage: null,
      lastBoundingBox: null,
    }));
  }

  function setBoundingBox(box: BoundingBox) {
    setState((prevState) => ({ ...prevState, lastBoundingBox: box }));
  }

  return (
    <CameraContext.Provider
      value={{
        criterias: state,
        setCriterias,
        flipCamera,
        finish,
        captureImage,
        captureImageCut,
        compareCapture,
        resetCapture,
        setBoundingBox,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error("useCamera must be used within a CameraProvider");
  }
  return context;
};
