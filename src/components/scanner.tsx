import React, { useEffect, useRef, useState } from "react";
import { useCamera } from "../context/recorder-context";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import ScannerWorker from "../workers/scannerWorker.ts?worker";

export function Scanner() {
  const { criterias } = useCamera();
  const [imageLoaded, setImageLoaded] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const [landmarker, setLandmarker] = useState<FaceLandmarker | null>(null);

  // Initialize MediaPipe Face Landmarker
  useEffect(() => {
    async function loadLandmarker() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
      );
      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        },
        runningMode: "IMAGE",
        numFaces: 1,
      });
      setLandmarker(faceLandmarker);
    }
    loadLandmarker();
  }, []);

  // Load image when capturedImage changes
  useEffect(() => {
    if (criterias.capturedImage) {
      const image = new Image();
      image.src = criterias.capturedImage;
      image.crossOrigin = "anonymous";
      image.onload = () => setImageLoaded(image);
      image.onerror = (err) => console.error("Gagal memuat gambar:", err);
    }
  }, [criterias.capturedImage]);

  // Initialize canvas and worker when the image is loaded and landmarker is ready
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded || !landmarker) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set canvas size before transferring control to OffscreenCanvas
    if (!canvas.width && !canvas.height) {
      // Set only if the canvas size has not been initialized
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    createImageBitmap(imageLoaded).then((imageBitmap) => {
      const result = landmarker.detect(imageBitmap);

      // Transfer control to OffscreenCanvas
      const offscreen = canvas.transferControlToOffscreen();

      // Create a Web Worker instance
      const worker = new ScannerWorker();
      workerRef.current = worker;

      // Send message to the worker with OffscreenCanvas, ImageBitmap, and landmarks
      worker.postMessage(
        {
          imageData: imageBitmap,
          width,
          height,
          canvas: offscreen,
          landmarks: result.faceLandmarks[0] || [],
        },
        [offscreen, imageBitmap],
      );

      // Optional: handle messages from the worker if necessary
      worker.onmessage = (e) => {
        // Handle worker response here, if needed
      };
    });

    return () => {
      // Clean up the worker when the component is unmounted
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [imageLoaded, landmarker]);

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 1000 }} // Set zIndex higher
      >
        <canvas
          ref={canvasRef}
          className="absolute left-0 top-0 h-full w-full"
          style={{ zIndex: 1000 }} // Ensure canvas is on top
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
          zIndex: 2000,
        }}
      ></div>
    </>
  );
}
