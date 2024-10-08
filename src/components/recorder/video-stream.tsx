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

  // Inisialisasi MediaPipe Face Detector
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

    // Cleanup saat komponen unmount
    return () => {
      if (faceDetectorRef.current) {
        faceDetectorRef.current.close();
      }
      isDetectingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fungsi untuk memulai loop deteksi
  const startDetection = useCallback(() => {
    if (isDetectingRef.current) return; // Hindari memulai deteksi ganda
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

            // Flip konteks kanvas jika video di-mirror
            if (facingMode === "user") {
              ctx.save();
              ctx.scale(-1, 1);
              ctx.translate(-canvas.width, 0);
            }

            const startTimeMs = performance.now();
            try {
              const detections = faceDetectorRef.current.detectForVideo(
                video,
                startTimeMs,
              ).detections;
              console.log("Detections:", detections);

              if (detections.length > 0) {
                detections.forEach((detection: Detection) => {
                  const box = detection.boundingBox;
                  const ctxBox = ctx;

                  // Menggambar bounding box
                  ctxBox.strokeStyle = "red";
                  ctxBox.lineWidth = 2;
                  ctxBox.strokeRect(
                    box.originX,
                    box.originY,
                    box.width,
                    box.height,
                  );

                  // Menggambar keypoints
                  detection.keypoints.forEach((keypoint) => {
                    ctxBox.fillStyle = "blue";
                    ctxBox.beginPath();
                    ctxBox.arc(keypoint.x, keypoint.y, 3, 0, 2 * Math.PI);
                    ctxBox.fill();
                  });
                });
              }
            } catch (err) {
              console.error("Detection error:", err);
            }

            // Mengembalikan konteks kanvas jika di-mirror
            if (facingMode === "user") {
              ctx.restore();
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

  // Fungsi untuk menghentikan deteksi
  const stopDetection = () => {
    isDetectingRef.current = false;
  };

  // Cleanup saat komponen unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  // Fungsi untuk toggle kamera
  const toggleFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  return (
    <div style={{ position: "relative" }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        mirrored={facingMode === "user"} // Mirror hanya kamera depan
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
