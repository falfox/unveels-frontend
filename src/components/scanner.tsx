import { useEffect, useRef, useState } from "react";
import { useCamera } from "../context/recorder-context";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export function Scanner() {
  const { criterias } = useCamera();
  const [imageLoaded, setImageLoaded] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Animasi Scanner dengan `requestAnimationFrame`
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Gagal mendapatkan konteks 2D untuk overlay canvas.");
      return;
    }

    let scanPosition = 0;
    let direction = 1; // 1 untuk turun, -1 untuk naik

    const animateScanner = () => {
      const { innerWidth: width, innerHeight: height } = window;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Hitung ukuran dan posisi gambar
      const imgAspect = imageLoaded.naturalWidth / imageLoaded.naturalHeight;
      const canvasAspect = width / height;
      let drawWidth, drawHeight, offsetX, offsetY;

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

      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        imageLoaded,
        -offsetX - drawWidth,
        offsetY,
        drawWidth,
        drawHeight,
      );
      ctx.restore();

      // Gambar animasi scanning (lapisan bawah hijau neon)
      ctx.fillStyle = "rgba(0, 255, 0, 0.6)";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(0, 255, 0, 1)";
      ctx.fillRect(0, scanPosition, width, 15);

      // Reset shadow sebelum menggambar lapisan atas
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      // Gambar lapisan atas (garis putih di tengah)
      ctx.fillStyle = "white";
      ctx.fillRect(0, scanPosition + 3, width, 9);

      // Update posisi scanner
      scanPosition += 5 * direction;
      if (scanPosition >= height - 15 || scanPosition <= 0) {
        direction *= -1; // Balik arah
      }

      requestAnimationFrame(animateScanner); // Panggil ulang untuk animasi berikutnya
    };

    animateScanner();

    return () => cancelAnimationFrame(animateScanner);
  }, [imageLoaded, canvasRef]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute left-0 top-0 h-full w-full"
        style={{ zIndex: 100 }}
      />
    </div>
  );
}
