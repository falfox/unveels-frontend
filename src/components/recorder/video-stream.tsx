import { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export function VideoSteam() {
  const webcamRef = useRef<Webcam>(null);
  const capture = useCallback(() => {}, [webcamRef]);

  const [error, setError] = useState(null as Error | null);

  return (
    <>
      <Webcam
        audio={false}
        height={window.innerHeight}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        mirrored={true}
        videoConstraints={videoConstraints}
        onUserMediaError={(error) => {
          if (error instanceof Error) {
            setError(error);
          }
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <p>{error.message}</p>
        </div>
      )}
    </>
  );
}
