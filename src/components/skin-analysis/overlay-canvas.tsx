import React, { useEffect } from "react";
import { Landmark } from "../../types/landmark";
import { BboxLandmark } from "../../types/bboxLandmark";
import { adjustBoundingBoxes } from "../../utils/boundingBoxUtils";

// Komponen Canvas untuk menggambar gambar di atas
interface OverlayCanvasProps {
  image: HTMLImageElement;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  data: BboxLandmark[]; // Pastikan data yang diterima adalah BboxLandmark[]
  landmarks: Landmark[];
}

function OverlayCanvas({
  image,
  canvasRef,
  data,
  landmarks,
}: OverlayCanvasProps) {
  // Define feature colors
  const featureColors: { [key: string]: string } = {
    spots: "255, 0, 0", // Red
    acne: "9, 183, 26", // Green
    blackhead: "0, 0, 0", // Black
    pore: "0, 0, 255", // Blue
  };

  // Define gradient radii
  const innerRadius = 0; // Start at the center
  const outerRadius = 20; // Adjust as needed

  useEffect(() => {
    // Fungsi untuk menggambar gambar dengan skala "cover"
    const drawImage = async () => {
      if (landmarks.length > 0) {
        try {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            console.error("Gagal mendapatkan konteks 2D untuk overlay canvas.");
            return;
          }
          const { innerWidth: width, innerHeight: height } = window;
          const dpr = window.devicePixelRatio || 1;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);

          const imgAspect = image.naturalWidth / image.naturalHeight;
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
          // Gambar landmark
          if (landmarks) {
            console.log("Landmarks:", landmarks);

            // Mendapatkan adjustedResults berdasarkan bounding boxes
            const adjustedResults: BboxLandmark[] = adjustBoundingBoxes(
              data, // BboxLandmark[]
              landmarks as Landmark[], // Pastikan ini sesuai tipe
              640,
              640,
              50, // Threshold diperbesar menjadi 50
            );

            // Menggambar bounding box yang disesuaikan berdasarkan indeks landmark
            // Gambar hanya fitur spesifik
            adjustedResults.forEach((bbox) => {
              // Filter for desired skin features
              const validLabels = ["spots", "acne", "blackhead"];
              if (!validLabels.includes(bbox.label)) {
                return; // Skip jika label tidak diinginkan
              }

              const [leftIndex, topIndex, rightIndex, bottomIndex] = bbox.box;

              // Pastikan indeks valid
              if (
                leftIndex === null ||
                topIndex === null ||
                rightIndex === null ||
                bottomIndex === null
              ) {
                return; // Skip jika ada indeks yang invalid
              }

              // Hitung posisi tengah dari bounding box
              const centerX =
                ((landmarks[leftIndex].x + landmarks[rightIndex].x) / 2) *
                  drawWidth +
                offsetX;
              const centerY =
                ((landmarks[topIndex].y + landmarks[bottomIndex].y) / 2) *
                  drawHeight +
                offsetY;

              // Dapatkan string warna RGB untuk fitur
              const rgbColor = featureColors[bbox.label] || "255, 255, 255"; // Default ke putih jika tidak didefinisikan

              // Buat radial gradient
              const gradient = ctx.createRadialGradient(
                centerX,
                centerY,
                innerRadius,
                centerX,
                centerY,
                outerRadius,
              );
              gradient.addColorStop(0, `rgba(${rgbColor}, 0.8)`); // Center sedikit transparan
              gradient.addColorStop(1, `rgba(${rgbColor}, 0)`); // Edge sepenuhnya transparan

              // Set gradient sebagai fill style
              ctx.fillStyle = gradient;

              // Gambar lingkaran gradient
              ctx.beginPath();
              ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
              ctx.fill();
              ctx.closePath();

              // Gambar lingkaran kecil di posisi landmark
              ctx.beginPath();
              ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI); // Sesuaikan radius jika perlu
              ctx.fillStyle = "white"; // Warna lingkaran putih
              ctx.fill();
              ctx.closePath();

              // Gambar garis dari landmark ke teks label
              const labelX = centerX + 50; // Sesuaikan posisi teks
              const labelY = centerY + 50; // Sesuaikan posisi teks

              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              ctx.lineTo(labelX, labelY); // Garis miring ke teks
              ctx.strokeStyle = "white"; // Set warna garis
              ctx.stroke();

              // Tambahkan label
              ctx.font = "18px Arial"; // Set font dan ukuran
              ctx.fillStyle = "white"; // Set warna teks
              ctx.fillText(bbox.label, labelX, labelY - 5); // Gambar teks dekat label

              // Gambar underline yang terhubung dengan garis miring
              const textWidth = ctx.measureText(bbox.label).width; // Ukur lebar teks
              const underlineEndX = labelX + textWidth; // Akhir underline
              const underlineY = labelY + 5; // Posisi Y underline

              // Hubungkan garis miring dengan underline
              ctx.beginPath();
              ctx.moveTo(labelX, labelY); // Mulai dari garis miring
              ctx.lineTo(underlineEndX, labelY); // Underline sejajar dengan teks
              ctx.strokeStyle = "white"; // Set warna underline
              ctx.stroke();
            });

            console.log("Adjusted Results:", adjustedResults);
          }
        } catch (error) {
          console.error("Failed Detect Landmark: ", error);
        }
      }
    };

    drawImage();
    window.addEventListener("resize", drawImage);

    return () => {
      window.removeEventListener("resize", drawImage);
    };
  }, [image, canvasRef, data, landmarks]);

  return null;
}

export default OverlayCanvas;
