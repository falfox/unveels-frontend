import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { useCamera } from "./recorder-context";
import {
  FaceDetector,
  FilesetResolver,
  Detection,
} from "@mediapipe/tasks-vision";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export function VideoStream() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [error, setError] = useState<Error | null>(null);
  const { criterias } = useCamera();
  const faceDetectorRef = useRef<FaceDetector | null>(null);
  const isDetectingRef = useRef<boolean>(false);

  // Initialize MediaPipe Face Detector
  useEffect(() => {
    const initializeFaceDetector = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm",
        );
        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
        });
        faceDetectorRef.current = detector;
        console.log("FaceDetector initialized");
        startDetection();
      } catch (err) {
        console.error("Failed to initialize FaceDetector:", err);
        setError(err as Error);
      }
    };

    initializeFaceDetector();

    // Cleanup when component unmounts
    return () => {
      if (faceDetectorRef.current) {
        faceDetectorRef.current.close();
      }
      isDetectingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to start the detection loop
  const startDetection = useCallback(() => {
    if (isDetectingRef.current) return; // Prevent multiple detections
    isDetectingRef.current = true;

    const detect = async () => {
      if (
        faceDetectorRef.current &&
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4 // video is ready
      ) {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const startTimeMs = performance.now();
            try {
              const detections = faceDetectorRef.current.detectForVideo(
                video,
                startTimeMs,
              ).detections;
              console.log("Detections:", detections);

              if (detections.length > 0) {
                // Menemukan deteksi dengan skor kategori tertinggi
                const highestScoreDetection = detections.reduce(
                  (max, detection) => {
                    return detection.categories[0].score >
                      max.categories[0].score
                      ? detection
                      : max;
                  },
                  detections[0],
                );

                console.log("Highest Score Detection:", highestScoreDetection);

                const box = highestScoreDetection.boundingBox;
                const keypoints = highestScoreDetection.keypoints;
                const ctxBox = ctx;

                // **Flip Bounding Box Origin X**
                const mirroredOriginX =
                  facingMode === "user"
                    ? canvas.width - (box.originX + box.width)
                    : box.originX;

                // Gambar bounding box
                ctxBox.strokeStyle = "red";
                ctxBox.lineWidth = 2;
                ctxBox.strokeRect(
                  mirroredOriginX,
                  box.originY,
                  box.width,
                  box.height,
                );

                // Gambar keypoints
                keypoints.forEach((keypoint, index) => {
                  // Konversi keypoint ke piksel
                  let x = keypoint.x * canvas.width;
                  let y = keypoint.y * canvas.height;

                  // Jika kamera dimirror, balik koordinat x
                  if (facingMode === "user") {
                    x = canvas.width - x;
                  }

                  // Debugging: Log koordinat keypoint
                  console.log(`Keypoint ${index}: (${x}, ${y})`);

                  ctxBox.fillStyle = "red";
                  ctxBox.beginPath();
                  ctxBox.arc(x, y, 4, 0, 2 * Math.PI); // Radius diperbesar untuk visibilitas
                  ctxBox.fill();
                });
              }
            } catch (err) {
              console.error("Detection error:", err);
            }
          }
        }
      }

      if (isDetectingRef.current) {
        requestAnimationFrame(detect);
      }
    };

    detect();
  }, [facingMode]);

  // Function to stop detection
  const stopDetection = () => {
    isDetectingRef.current = false;
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  // Function to toggle camera
  const toggleFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  return (
    <div style={{ position: "relative" }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        mirrored={false} // Set ke false karena akan di-mirror via CSS
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
          width: "100%",
          height: "auto",
          transform: facingMode === "user" ? "scaleX(-1)" : "none", // Mirror video jika user
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <p>{error.message}</p>
        </div>
      )}
      <button
        onClick={toggleFacingMode}
        className="absolute bottom-4 right-4 rounded bg-blue-500 p-2 text-white"
      >
        Flip Camera
      </button>
    </div>
  );
}
