// src/workers/scannerWorker.ts

import { Landmark } from "../types/landmark";
import { faces } from "../utils/constants";

// Interface untuk pesan yang diterima dari main thread
interface WorkerMessage {
  imageData: ImageBitmap;
  width: number;
  height: number;
  canvas: OffscreenCanvas;
  landmarks: Landmark[];
}

function calculateHeadRotation(faceLandmarks: Landmark[]) {
  const nose = faceLandmarks[33];
  const chin = faceLandmarks[152];
  const leftTemple = faceLandmarks[234];
  const rightTemple = faceLandmarks[454];

  const deltaY = chin.y - nose.y;
  const deltaZ = chin.z - nose.z;
  const pitch = Math.atan2(deltaY, deltaZ);

  const deltaX = rightTemple.x - leftTemple.x;
  const roll = Math.atan2(deltaY, deltaX);

  return { pitch, roll };
}

function applyStretchedLandmarks(faceLandmarks: Landmark[]) {
  return faceLandmarks.map((landmark, index) => {
    const isForehead = [54, 103, 67, 109, 10, 338, 297, 332, 284].includes(
      index,
    );

    if (isForehead) {
      const { pitch } = calculateHeadRotation(faceLandmarks);
      const foreheadShiftY = Math.sin(pitch) * 0.06;
      const foreheadShiftZ = Math.cos(pitch) * 0.1;

      return {
        x: landmark.x,
        y: landmark.y - foreheadShiftY,
        z: landmark.z + foreheadShiftZ,
      };
    }
    return landmark;
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { imageData, width, height, canvas, landmarks } = event.data;

  let glowOffset = 0;
  const glowSpeed = 0.03;

  if (!(canvas instanceof OffscreenCanvas)) {
    console.error("Canvas yang diterima bukan OffscreenCanvas.");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Gagal mendapatkan konteks 2D untuk OffscreenCanvas.");
    return;
  }

  // Perhitungan ukuran dan posisi gambar dengan mempertimbangkan offset
  const imgAspect = imageData.width / imageData.height;
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

  // Gambar gambar awal dengan transformasi dan offset
  const drawImageWithTransform = () => {
    ctx.save(); // Simpan state canvas
    // Gambar tanpa flip
    ctx.drawImage(
      imageData,
      offsetX, // Offset X langsung digunakan
      offsetY,
      drawWidth,
      drawHeight,
    );
    ctx.restore(); // Pulihkan state canvas
  };

  const drawConnectorsFromFaces = (
    faceLandmarks: Landmark[],
    gradient: CanvasGradient,
    faces: number[],
  ) => {
    // Iterasi setiap 3 angka di dalam `faces` untuk membentuk segitiga
    for (let i = 0; i < faces.length; i += 3) {
      const indexA = faces[i];
      const indexB = faces[i + 1];
      const indexC = faces[i + 2];

      const pointA = faceLandmarks[indexA];
      const pointB = faceLandmarks[indexB];
      const pointC = faceLandmarks[indexC];

      // Hitung posisi tiap titik relatif terhadap gambar di canvas
      const ax = offsetX + pointA.x * drawWidth;
      const ay = offsetY + pointA.y * drawHeight;

      const bx = offsetX + pointB.x * drawWidth;
      const by = offsetY + pointB.y * drawHeight;

      const cx = offsetX + pointC.x * drawWidth;
      const cy = offsetY + pointC.y * drawHeight;

      // Gambar segitiga
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.lineTo(cx, cy);
      ctx.closePath();

      // Stroke segitiga dengan gradient
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  };

  const animateScanner = () => {
    ctx.clearRect(0, 0, width, height); // Bersihkan canvas
    ctx.imageSmoothingEnabled = false;

    // Gambar gambar awal dengan transformasi dan offset
    drawImageWithTransform();

    glowOffset += glowSpeed;
    if (glowOffset > 1.5) glowOffset = 0;

    const faceLandmarks = applyStretchedLandmarks(landmarks);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

    // Pastikan semua nilai berada dalam rentang [0, 1]
    gradient.addColorStop(
      clamp(glowOffset - 0.1, 0, 1),
      "rgba(42, 96, 176, 0.1)",
    );
    gradient.addColorStop(clamp(glowOffset, 0, 1), "rgba(44, 98, 180, 0.46)");
    gradient.addColorStop(
      clamp(glowOffset + 0.1, 0, 1),
      "rgba(42, 96, 176, 0.1)",
    );

    // Gambar landmarks dengan warna gradient  // Gambar connectors berdasarkan `faces`
    drawConnectorsFromFaces(faceLandmarks, gradient, faces);

    // Minta frame berikutnya
    self.requestAnimationFrame(animateScanner);
  };

  // Mulai animasi
  animateScanner();
};
