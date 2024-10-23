import { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useCamera } from "../recorder/recorder-context";
import { VIDEO_WIDTH, VIDEO_HEIGHT } from "../../utils/constants";
import { ErrorOverlay } from "../error-overlay";
import { Landmark } from "../../types/landmark";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import VirtualTryOnThreeScene from "./virtual-try-on-three-scene";

export function VirtualTryOnScene() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<Error | null>(null);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(
    null,
  );
  const [landmarks, setLandmarks] = useState<Landmark[]>([]); // Tipe yang diperbarui
  const [isLandmarkerReady, setIsLandmarkerReady] = useState<boolean>(false);
  const isDetectingRef = useRef<boolean>(false);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);

  // Using CameraContext
  const { criterias, flipCamera } = useCamera();

  useEffect(() => {
    let isMounted = true; // Untuk mencegah pembaruan state setelah unmount

    const initializeFaceLandmarker = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
        );
        const landmarker = await FaceLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU", // Opsional: gunakan "GPU" jika didukung
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1,
          },
        );
        if (isMounted) {
          faceLandmarkerRef.current = landmarker;
          setFaceLandmarker(landmarker);
          setIsLandmarkerReady(true);
          startDetection();
        }
      } catch (error) {
        console.error("Gagal menginisialisasi FaceLandmarker:", error);
      }
    };

    initializeFaceLandmarker();

    // Cleanup pada unmount
    return () => {
      isMounted = false;
      if (faceLandmarker) {
        faceLandmarker.close();
      }
    };
  }, []);

  // Function to start the detection loop
  const startDetection = useCallback(() => {
    if (isDetectingRef.current) return;
    isDetectingRef.current = true;

    const detect = async () => {
      if (
        faceLandmarkerRef.current &&
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const { innerWidth: width, innerHeight: height } = window;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            const imgAspect = video.videoWidth / video.videoHeight;
            const canvasAspect = width / height;

            let drawWidth: number;
            let drawHeight: number;
            let offsetX: number;
            let offsetY: number;

            if (imgAspect < canvasAspect) {
              drawWidth = width;
              drawHeight = width / imgAspect;
              offsetX = 0;
              offsetY = (height - drawHeight) / 2;
            } else {
              drawWidth = height * imgAspect;
              drawHeight = height;
              offsetX = (width - drawWidth) / 2;
              offsetY = 0;
            }

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

            const startTimeMs = performance.now();
            try {
              const detections = faceLandmarkerRef.current.detectForVideo(
                video,
                startTimeMs,
              ).faceLandmarks[0];

              // set landmark
              setLandmarks(detections);
            } catch (err) {
              console.error("Detection error:", err);
              setError(err as Error);
            }
          }
        }
      }

      if (isDetectingRef.current) {
        requestAnimationFrame(detect);
      }
    };

    detect();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {/* 3D Canvas */}
      <Canvas
        className="absolute left-0 top-0 h-full w-full"
        style={{ zIndex: 50 }}
        orthographic
        camera={{ zoom: 1, position: [0, 0, 10], near: -1000, far: 1000 }}
        gl={{
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1,
          outputColorSpace: SRGBColorSpace,
        }}
      >
        <VirtualTryOnThreeScene videoRef={webcamRef} landmakrs={landmarks} />
      </Canvas>

      <Webcam
        className="hidden"
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        mirrored={false}
        videoConstraints={{
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT,
          facingMode: criterias.flipped ? "environment" : "user",
        }}
        onUserMediaError={(err) =>
          setError(
            err instanceof Error ? err : new Error("Webcam error occurred."),
          )
        }
      />

      {/* Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute left-0 top-0 hidden h-full w-full`}
        style={{ zIndex: 40 }}
      />

      {/* Error Display */}
      {error && <ErrorOverlay message={error.message} />}
    </div>
  );
}
