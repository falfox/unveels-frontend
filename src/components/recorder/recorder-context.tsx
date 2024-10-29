// recorder-context.tsx
import html2canvas from "html2canvas";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  MutableRefObject,
  useCallback,
  useEffect,
} from "react";
import { useReactMediaRecorder } from "react-media-recorder";
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
  targetRef: MutableRefObject<HTMLDivElement | null>;
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
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const targetRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);

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

  const startRecording = async () => {
    if (!targetRef.current) {
      console.error("No target element found");
      return;
    }

    const canvas = await html2canvas(targetRef.current);
    const stream = canvas.captureStream(100);

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data && e.data.size > 0) {
        setChunks((prev) => [...prev, e.data]);
      }
    };

    const updateCanvas = async () => {
      const updatedCanvas = await html2canvas(
        targetRef.current as HTMLDivElement,
      );
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(updatedCanvas, 0, 0);
      }
      animationRef.current = requestAnimationFrame(updateCanvas);
    };

    animationRef.current = requestAnimationFrame(updateCanvas);

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const pauseRecording = () => {};

  const resumeRecording = () => {};

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null; // Reset reference
    }
  };

  const downloadVideo = async () => {
    console.log("downloadVideo", chunks);
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    a.click();

    // Bersihkan chunks setelah selesai
    setChunks([]);
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
        targetRef,
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
