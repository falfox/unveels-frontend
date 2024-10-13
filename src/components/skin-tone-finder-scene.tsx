// components/SkinToneFinderScene.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useCamera } from "./recorder/recorder-context";
import {
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

interface SkinToneFinderSceneProps {
  debugMode?: boolean; // Optional prop for debug mode
}

export function SkinToneFinderScene({
  debugMode = false,
}: SkinToneFinderSceneProps) {
  const { criterias } = useCamera();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState<HTMLImageElement | null>(null);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(
    null,
  );
  const [isLandmarkerReady, setIsLandmarkerReady] = useState<boolean>(false);

  // Memuat gambar ketika capturedImage berubah
  useEffect(() => {
    if (criterias.capturedImage) {
      const image = new Image();
      image.src = criterias.capturedImage;
      image.onload = () => {
        setImageLoaded(image);
      };
      image.onerror = (err) => {
        console.error("Gagal memuat gambar:", err);
        // Tambahkan penanganan error jika diperlukan
      };
    }
  }, [criterias.capturedImage]);

  // Inisialisasi FaceLandmarker
  useEffect(() => {
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
              delegate: "GPU", // Opsional: gunakan "GPU" jika perangkat mendukung
            },
            outputFaceBlendshapes: true,
            runningMode: "IMAGE",
            numFaces: 1,
          },
        );
        setFaceLandmarker(landmarker);
        setIsLandmarkerReady(true);
      } catch (error) {
        console.error("Gagal menginisialisasi FaceLandmarker:", error);
      }
    };

    initializeFaceLandmarker();

    // Cleanup saat komponen di-unmount
    return () => {
      if (faceLandmarker) {
        faceLandmarker.close();
      }
    };
  }, []);

  // Fungsi untuk menggambar gambar pada canvas dan menggambar landmark
  const drawImage = useCallback(async () => {
    if (
      !imageLoaded ||
      !canvasRef.current ||
      !containerRef.current ||
      !faceLandmarker ||
      !isLandmarkerReady
    )
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const dpr = window.devicePixelRatio || 1;

    // Mengatur ukuran internal canvas berdasarkan devicePixelRatio
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;

    // Reset transform sebelum menggambar ulang
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Menghitung rasio aspek
    const imageAspectRatio = imageLoaded.width / imageLoaded.height;
    const containerAspectRatio = containerWidth / containerHeight;

    let drawWidth = containerWidth;
    let drawHeight = containerHeight;

    if (imageAspectRatio > containerAspectRatio) {
      // Gambar lebih lebar daripada kontainer, gunakan tinggi kontainer
      drawHeight = containerHeight;
      drawWidth = drawHeight * imageAspectRatio;
    } else {
      // Gambar lebih tinggi daripada kontainer, gunakan lebar kontainer
      drawWidth = containerWidth;
      drawHeight = drawWidth / imageAspectRatio;
    }

    const xOffset = (containerWidth - drawWidth) / 2;
    const yOffset = (containerHeight - drawHeight) / 2;

    // Membersihkan canvas sebelum menggambar
    ctx.clearRect(0, 0, containerWidth, containerHeight);

    // Menggambar gambar dengan ukuran yang sesuai
    ctx.drawImage(imageLoaded, xOffset, yOffset, drawWidth, drawHeight);

    // Memproses gambar dengan FaceLandmarker
    try {
      const faceLandmarkerResult = await faceLandmarker.detect(imageLoaded);

      if (
        faceLandmarkerResult &&
        faceLandmarkerResult.faceLandmarks.length > 0
      ) {
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;

        const drawingUtils = new DrawingUtils(ctx);

        faceLandmarkerResult.faceLandmarks.forEach((landmarks) => {
          // Menggambar setiap set konektor landmark
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_TESSELATION,
            { color: "#C0C0C070", lineWidth: 1 },
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
            { color: "#FF3030" },
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
            { color: "#FF3030" },
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
            { color: "#30FF30" },
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
            { color: "#30FF30" },
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
            { color: "#E0E0E0" },
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LIPS,
            { color: "#E0E0E0" },
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
            { color: "#FF3030" },
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
            { color: "#30FF30" },
          );
        });
      }
    } catch (error) {
      console.error("Gagal mendeteksi wajah:", error);
    }
  }, [imageLoaded, faceLandmarker, isLandmarkerReady]);

  // Menggambar gambar saat gambar dimuat dan saat ukuran kontainer berubah
  useEffect(() => {
    if (imageLoaded && faceLandmarker && isLandmarkerReady) {
      drawImage();

      const resizeObserver = new ResizeObserver(() => {
        drawImage();
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [imageLoaded, faceLandmarker, isLandmarkerReady, drawImage]);

  // Jika belum ada gambar yang ditangkap, tidak menampilkan apa-apa
  if (!criterias.capturedImage) {
    return null;
  }

  return (
    <div className="relative h-full w-full" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute left-0 top-0 h-full w-full bg-black"
      />
    </div>
  );
}
