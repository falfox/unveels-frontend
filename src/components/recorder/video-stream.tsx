import { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import { useCamera } from "./recorder-context";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export function VideoStream() {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [error, setError] = useState<Error | null>(null);
  const { criterias } = useCamera();

  const toggleFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const capture = useCallback(() => {}, [webcamRef]);

  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        mirrored={facingMode === "user"}
        videoConstraints={{
          ...videoConstraints,
          facingMode: criterias.flipped ? "environment" : "user",
        }}
        onUserMediaError={(error) => {
          if (error instanceof Error) {
            setError(error);
          }
        }}
        style={{
          height: window.innerHeight,
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <p>{error.message}</p>
        </div>
      )}
      <button
        onClick={toggleFacingMode}
        className="absolute p-2 text-white bg-blue-500 rounded bottom-4 right-4"
      >
        Flip Camera
      </button>
    </>
  );
}
