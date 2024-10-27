// recorder-context.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  MutableRefObject,
  useCallback,
} from "react";
import Webcam from "react-webcam";
import { RecordRTCPromisesHandler } from "recordrtc";

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

interface SkinToneThreeSceneRef {
  callFunction: () => void;
}

interface CameraContextType {
  skinToneThreeSceneRef: MutableRefObject<SkinToneThreeSceneRef | null>;
  webcamRef: MutableRefObject<Webcam | null>;
  recorderRef: MutableRefObject<RecordRTCPromisesHandler | null>;
  criterias: CameraState;
  setCriterias: (newState: Partial<CameraState>) => void;
  flipCamera: () => void;
  finish: () => void;
  captureImage: (image: string) => void;
  captureImageCut: (image: string) => void;
  compareCapture: () => void;
  resetCapture: () => void;
  setBoundingBox: (box: BoundingBox) => void;
  screenShoot: () => void;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  downloadVideo: () => void;
  exit: () => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const skinToneThreeSceneRef = useRef<{ callFunction: () => void }>(null);
  const webcamRef = useRef<Webcam>(null);
  const recorderRef = useRef<RecordRTCPromisesHandler | null>(null);

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

  function screenShoot() {
    if (skinToneThreeSceneRef.current) {
      skinToneThreeSceneRef.current.callFunction();
    }
  }

  // start recording
  const startRecording = useCallback(async () => {
    if (webcamRef.current && webcamRef.current.stream) {
      const mixedStream = new MediaStream([
        ...webcamRef.current.stream.getVideoTracks(),
        ...webcamRef.current.stream.getAudioTracks(),
      ]);

      recorderRef.current = new RecordRTCPromisesHandler(mixedStream, {
        type: "video",
        mimeType: "video/webm",
      });
      await recorderRef.current.startRecording();
    }
  }, []);

  const pauseRecording = async () => {
    if (recorderRef.current) {
      await recorderRef.current.pauseRecording();
    }
  };

  const resumeRecording = async () => {
    if (recorderRef.current) {
      await recorderRef.current.resumeRecording();
    }
  };

  //  stop  recording
  const stopRecording = async () => {
    if (recorderRef.current) {
      await recorderRef.current.stopRecording();
    }
  };

  const downloadVideo = async () => {
    if (recorderRef.current) {
      const blob = await recorderRef.current.getBlob();

      // Unduh file video
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recorded_video.webm";
      a.click();
      URL.revokeObjectURL(url);

      recorderRef.current = null;
    }
    setState((prevState) => ({ ...prevState, isFinished: false }));
  };

  function exit() {
    if (recorderRef.current) {
      recorderRef.current = null;
    }
    setState((prevState) => ({ ...prevState, isFinished: false }));
  }

  return (
    <CameraContext.Provider
      value={{
        skinToneThreeSceneRef,
        webcamRef,
        recorderRef,
        criterias: state,
        setCriterias,
        flipCamera,
        finish,
        captureImage,
        captureImageCut,
        compareCapture,
        resetCapture,
        setBoundingBox,
        screenShoot,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        downloadVideo,
        exit,
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
