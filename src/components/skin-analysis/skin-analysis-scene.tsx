// src/components/skin-analysis-scene.tsx
import React, { useEffect, useRef, useState } from "react";
import { useCamera } from "../recorder/recorder-context";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Canvas, MeshProps, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import FaceMesh from "../three/face-mesh";
import { Landmark } from "../../types/landmark";
import { BboxLandmark } from "../../types/bboxLandmark";
import { adjustBoundingBoxes } from "../../utils/boundingBoxUtils";

// Komponen Canvas untuk menggambar gambar di atas
interface ImageCanvasProps {
  image: HTMLImageElement;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  data: BboxLandmark[]; // Pastikan data yang diterima adalah BboxLandmark[]
  landmarks: Landmark[];
}

function ImageCanvas({ image, canvasRef, data, landmarks }: ImageCanvasProps) {
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

// Komponen untuk menampilkan gambar menggunakan React Three Fiber
interface ImageBackgroundProps extends MeshProps {
  imageSrc: string;
  landmarks: Landmark[];
}

const ImageBackground: React.FC<ImageBackgroundProps> = ({
  imageSrc,
  landmarks,
  ...props
}) => {
  const texture = useTexture(imageSrc);
  const { viewport } = useThree();

  // Hitung ukuran plane berdasarkan rasio aspek gambar dan viewport
  const [planeSize, setPlaneSize] = useState<[number, number]>([1, 1]);

  useEffect(() => {
    const imageAspect = texture.image.width / texture.image.height;
    const viewportAspect = viewport.width / viewport.height;

    let planeWidth: number;
    let planeHeight: number;

    if (imageAspect > viewportAspect) {
      // Gambar lebih lebar dibandingkan viewport
      planeHeight = viewport.height;
      planeWidth = viewport.height * imageAspect;
    } else {
      // Gambar lebih tinggi atau sama dengan rasio aspek viewport
      planeWidth = viewport.width;
      planeHeight = viewport.width / imageAspect;
    }

    setPlaneSize([planeWidth, planeHeight]);
  }, []);

  return (
    <mesh {...props}>
      <planeGeometry args={[planeSize[0], planeSize[1]]} />
      <meshBasicMaterial map={texture} />
      <FaceMesh
        planeSize={planeSize}
        landmarks={landmarks}
        hexColor={"#0096FF"}
      />
    </mesh>
  );
};

// Komponen utama SkinAnalysisScene yang menggabungkan Three.js Canvas dan ImageCanvas
interface SkinAnalysisSceneProps {
  data: BboxLandmark[]; // Pastikan data yang diterima adalah BboxLandmark[]
}

export function SkinAnalysisScene({ data }: SkinAnalysisSceneProps) {
  const { criterias } = useCamera();
  const [imageLoaded, setImageLoaded] = useState<HTMLImageElement | null>(null);

  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(
    null,
  );
  const [isLandmarkerReady, setIsLandmarkerReady] = useState<boolean>(false);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]); // Tipe yang diperbarui

  // Memuat gambar ketika capturedImage berubah
  useEffect(() => {
    console.log("scene ", data);

    if (criterias.capturedImage) {
      const image = new Image();
      image.src = criterias.capturedImage;
      image.crossOrigin = "anonymous"; // Menghindari masalah CORS
      image.onload = () => {
        console.log("image loaded");
        setImageLoaded(image);
      };
      image.onerror = (err) => {
        console.error("Gagal memuat gambar:", err);
      };
    }
  }, [criterias.capturedImage, data]);

  // Inisialisasi FaceLandmarker
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
            runningMode: "IMAGE",
            numFaces: 1,
          },
        );
        if (isMounted) {
          setFaceLandmarker(landmarker);
          setIsLandmarkerReady(true);
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

  // Memproses gambar dan mendeteksi landmark
  useEffect(() => {
    const processImage = async () => {
      if (imageLoaded && faceLandmarker && isLandmarkerReady) {
        try {
          const results = await faceLandmarker.detect(imageLoaded);
          if (results && results.faceLandmarks.length > 0) {
            // Asumsikan wajah pertama
            const firstFace = results.faceLandmarks[0];
            // Konversi landmark ke koordinat normal dengan z
            const normalizedLandmarks = firstFace.map((landmark) => ({
              x: landmark.x,
              y: landmark.y,
              z: landmark.z,
            }));
            setLandmarks(normalizedLandmarks);
          }
        } catch (error) {
          console.error("Gagal mendeteksi wajah:", error);
        }
      }
    };

    processImage();
  }, [imageLoaded, faceLandmarker, isLandmarkerReady]);

  // Jika tidak ada gambar yang ditangkap atau gambar belum dimuat, render hanya canvas overlay
  if (!criterias.capturedImage || !imageLoaded) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {/* Three.js Canvas */}
      <Canvas
        className="absolute left-0 top-0 h-full w-full"
        style={{ zIndex: 0 }}
        orthographic
        camera={{ zoom: 1, position: [0, 0, 10], near: 0.1, far: 1000 }}
      >
        <ambientLight />
        <ImageBackground
          imageSrc={criterias.capturedImage}
          landmarks={landmarks}
        />
      </Canvas>

      {/* Overlay Canvas */}
      <canvas
        ref={overlayCanvasRef}
        className="pointer-events-none absolute left-0 top-0 h-full w-full"
        style={{ zIndex: 50 }}
      />
      {/* Komponen untuk menggambar gambar di overlay canvas */}
      <ImageCanvas
        image={imageLoaded}
        canvasRef={overlayCanvasRef}
        data={data}
        landmarks={landmarks}
      />
    </div>
  );
}

export default SkinAnalysisScene;
