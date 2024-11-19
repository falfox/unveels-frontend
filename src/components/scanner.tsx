// src/components/scanner.tsx
import React, { useEffect, useRef, useState } from "react";
import { useCamera } from "../context/recorder-context";
import ScannerWorker from "../workers/scannerWorker.ts?worker";
import { FaceLandmarker } from "@mediapipe/tasks-vision";

export function Scanner() {
  const { criterias } = useCamera();
  const [imageLoaded, setImageLoaded] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);

  useEffect(() => {});

  // Memuat gambar ketika capturedImage berubah
  useEffect(() => {
    if (criterias.capturedImage) {
      const image = new Image();
      image.src = criterias.capturedImage;
      image.crossOrigin = "anonymous";
      image.onload = () => setImageLoaded(image);
      image.onerror = (err) => console.error("Gagal memuat gambar:", err);
    }
  }, [criterias.capturedImage]);

  // Menginisialisasi Web Worker dan OffscreenCanvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Mengatur ukuran canvas
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Transfer kontrol ke OffscreenCanvas
    const offscreen = canvas.transferControlToOffscreen();

    // Membuat ImageBitmap dari gambar yang dimuat
    createImageBitmap(imageLoaded).then((imageBitmap) => {
      // Membuat instance Web Worker
      const worker = new ScannerWorker();
      workerRef.current = worker;

      // Mengirim pesan ke worker dengan OffscreenCanvas dan ImageBitmap
      worker.postMessage(
        {
          imageData: imageBitmap,
          width,
          height,
          canvas: offscreen,
        },
        [offscreen, imageBitmap],
      );

      // Opsional: Menangani pesan dari worker jika diperlukan
      worker.onmessage = (e) => {
        // Tidak perlu melakukan apapun di sini
      };
    });

    return () => {
      // Membersihkan worker saat komponen di-unmount
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [imageLoaded]);

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 1000 }} // Set zIndex lebih tinggi
      >
        <canvas
          ref={canvasRef}
          className="absolute left-0 top-0 h-full w-full"
          style={{ zIndex: 1000 }} // Pastikan canvas berada di atas
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
