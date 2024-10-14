import React, { useEffect, useRef, useState } from "react";
import { useCamera } from "../recorder/recorder-context";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Canvas, useThree } from "@react-three/fiber";
import { Texture, TextureLoader, Vector3 } from "three";
import { useSkinColor } from "./skin-color-context"; // Pastikan path ini benar
import {
  calculateAverageColor,
  classifySkinType,
  rgbToHex,
} from "../../utils/colorUtils"; // Pastikan path ini benar
import FaceMesh from "./face-mesh"; // Pastikan path ini benar

// Komponen Canvas untuk menggambar gambar di atas
interface ImageCanvasProps {
  image: HTMLImageElement;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

function ImageCanvas({ image, canvasRef }: ImageCanvasProps) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Gagal mendapatkan konteks 2D untuk overlay canvas.");
      return;
    }

    // Fungsi untuk menggambar gambar dengan skala "cover"
    const drawImage = () => {
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
      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    };

    drawImage();
    window.addEventListener("resize", drawImage);

    return () => {
      window.removeEventListener("resize", drawImage);
    };
  }, [image, canvasRef]);

  return null;
}

interface SkinToneFinderSceneProps {
  debugMode?: boolean; // Opsional untuk mode debug
}

export function SkinToneFinderScene({
  debugMode = false,
}: SkinToneFinderSceneProps) {
  return <SkinToneFinderInnerScene debugMode={debugMode} />;
}

interface SkinToneFinderInnerSceneProps {
  debugMode: boolean;
}

// Definisikan interface Landmark
interface Landmark {
  x: number;
  y: number;
  z: number;
}

function SkinToneFinderInnerScene({
  debugMode,
}: SkinToneFinderInnerSceneProps) {
  const { criterias } = useCamera();
  const [imageLoaded, setImageLoaded] = useState<HTMLImageElement | null>(null);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(
    null,
  );
  const [landmarks, setLandmarks] = useState<Landmark[]>([]); // Tipe yang diperbarui
  const [isLandmarkerReady, setIsLandmarkerReady] = useState<boolean>(false);

  const { setSkinColor } = useSkinColor(); // Akses setter dari konteks

  // Ref untuk overlay canvas
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  // State untuk melacak pemuatan tekstur
  const [isTextureLoaded, setIsTextureLoaded] = useState<boolean>(false);

  // Handler untuk mengatur status pemuatan tekstur
  const handleTextureLoaded = () => {
    setIsTextureLoaded(true);
  };

  // Memuat gambar ketika capturedImage berubah
  useEffect(() => {
    if (criterias.capturedImage) {
      const image = new Image();
      image.src = criterias.capturedImage;
      image.crossOrigin = "anonymous"; // Menghindari masalah CORS
      image.onload = () => {
        setImageLoaded(image);
      };
      image.onerror = (err) => {
        console.error("Gagal memuat gambar:", err);
      };
    }
  }, [criterias.capturedImage]);

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

            // Ekstrak warna kulit
            extractSkinColor(imageLoaded, normalizedLandmarks);
          }
        } catch (error) {
          console.error("Gagal mendeteksi wajah:", error);
        }
      }
    };

    processImage();
  }, [imageLoaded, faceLandmarker, isLandmarkerReady]);

  /**
   * Mengekstrak warna kulit dari landmark tertentu.
   * @param image - Gambar yang dimuat.
   * @param landmarks - Array dari koordinat {x, y, z} yang dinormalisasi.
   */
  const extractSkinColor = (image: HTMLImageElement, landmarks: Landmark[]) => {
    // Definisikan indeks landmark untuk ekstraksi warna kulit
    const targetLandmarkIndices = [101, 50, 330, 280, 108, 69, 151, 337, 299];

    // Radius sekitar setiap landmark untuk sampling warna
    const samplingRadius = 5; // piksel

    // Buat canvas off-screen untuk mengakses data piksel
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error(
        "Gagal mendapatkan konteks canvas untuk ekstraksi warna kulit.",
      );
      return;
    }
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    const sampledColors: Array<{ r: number; g: number; b: number }> = [];

    targetLandmarkIndices.forEach((index) => {
      const landmark = landmarks[index];
      if (!landmark) {
        console.warn(`Indeks landmark ${index} tidak ditemukan.`);
        return;
      }

      const { x: normX, y: normY } = landmark;
      const x = Math.round(normX * canvas.width);
      const y = Math.round(normY * canvas.height);

      // Sampling area persegi di sekitar landmark
      for (let dx = -samplingRadius; dx <= samplingRadius; dx++) {
        for (let dy = -samplingRadius; dy <= samplingRadius; dy++) {
          const sampleX = x + dx;
          const sampleY = y + dy;

          // Pastikan koordinat sampling berada dalam batas gambar
          if (
            sampleX < 0 ||
            sampleX >= canvas.width ||
            sampleY < 0 ||
            sampleY >= canvas.height
          ) {
            continue;
          }

          const pixelIndex = (sampleY * canvas.width + sampleX) * 4;
          const r = imageData[pixelIndex];
          const g = imageData[pixelIndex + 1];
          const b = imageData[pixelIndex + 2];
          const a = imageData[pixelIndex + 3];

          // Opsional: filter piksel transparan atau bukan kulit
          if (a < 128) continue; // Lewati piksel semi-transparan

          sampledColors.push({ r, g, b });
        }
      }
    });

    if (sampledColors.length === 0) {
      console.warn(
        "Tidak ada warna yang disampling untuk ekstraksi warna kulit.",
      );
      return;
    }

    // Hitung warna rata-rata
    const avgColor = calculateAverageColor(sampledColors);
    const hexColor = rgbToHex(avgColor.r, avgColor.g, avgColor.b);

    // Klasifikasikan tipe kulit
    const skinType = classifySkinType(avgColor);

    // Perbarui konteks
    setSkinColor(hexColor, skinType);
  };

  // Jika tidak ada gambar yang ditangkap, render hanya canvas overlay
  if (!criterias.capturedImage || !imageLoaded) {
    return null;
  }

  return (
    <div className="fixed inset-0">
      {/* Render kondisional overlay canvas */}
      {!isTextureLoaded && (
        <>
          {/* Canvas Overlay untuk menampilkan gambar */}
          <canvas
            ref={overlayCanvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ zIndex: 10 }}
          />

          {/* Komponen untuk menggambar gambar di overlay canvas */}
          <ImageCanvas image={imageLoaded} canvasRef={overlayCanvasRef} />
        </>
      )}

      {/* 3D Canvas */}
      <Canvas
        className="absolute inset-0 h-full w-full"
        camera={{ position: [0, 0, 2], fov: 50 }}
        // Aktifkan device pixel ratio untuk kejernihan lebih baik di mobile
        dpr={[1, 2]}
      >
        <Scene
          image={imageLoaded}
          landmarks={landmarks}
          debugMode={debugMode}
          onTextureLoaded={handleTextureLoaded} // Kirim handler
        />
      </Canvas>
    </div>
  );
}

interface SceneProps {
  image: HTMLImageElement;
  landmarks: Landmark[]; // Tipe yang diperbarui
  debugMode: boolean;
  onTextureLoaded: () => void; // Callback baru
}

function Scene({ image, landmarks, debugMode, onTextureLoaded }: SceneProps) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const { camera, size } = useThree();

  // State untuk menyimpan rasio aspek gambar
  const [imageAspect, setImageAspect] = useState<number>(1);

  // Memuat tekstur
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      image.src,
      (tex) => {
        tex.needsUpdate = true;
        setTexture(tex);
        onTextureLoaded(); // Notifikasi ke parent bahwa tekstur telah dimuat
      },
      undefined,
      (err) => {
        console.error("Gagal memuat tekstur:", err);
      },
    );
  }, [image, onTextureLoaded]);

  // Perbarui rasio aspek saat gambar dimuat
  useEffect(() => {
    if (image) {
      const aspect = image.naturalWidth / image.naturalHeight;
      setImageAspect(aspect);
    }
  }, [image]);

  // Hitung ukuran plane berdasarkan rasio aspek gambar dan viewport
  const [planeSize, setPlaneSize] = useState<[number, number]>([1, 1]);

  useEffect(() => {
    const calculatePlaneSize = () => {
      const distance = camera.position.z;
      const fov = camera.fov * (Math.PI / 180); // Konversi ke radian
      const viewHeight = 2 * Math.tan(fov / 2) * distance;
      const viewWidth = viewHeight * (size.width / size.height);

      const imageAspectRatio = imageAspect;
      const viewAspectRatio = size.width / size.height;

      let finalWidth: number;
      let finalHeight: number;

      if (imageAspectRatio > viewAspectRatio) {
        finalHeight = viewHeight;
        finalWidth = viewHeight * imageAspectRatio;
      } else {
        finalWidth = viewWidth;
        finalHeight = viewWidth / imageAspectRatio;
      }

      setPlaneSize([finalWidth, finalHeight]);
    };

    calculatePlaneSize();
  }, [camera, size, imageAspect]);

  const { hexColor } = useSkinColor();

  return (
    <>
      {texture && (
        <mesh>
          <planeGeometry args={[planeSize[0], planeSize[1]]} />
          <meshBasicMaterial map={texture} />
          <FaceMesh
            planeSize={planeSize}
            landmarks={landmarks}
            hexColor={hexColor}
          />
        </mesh>
      )}
      {debugMode && landmarks.length > 0 && (
        <LandmarkSpheres landmarks={landmarks} planeSize={planeSize} />
      )}
    </>
  );
}

interface LandmarkSpheresProps {
  landmarks: Landmark[]; // Tipe yang diperbarui
  planeSize: [number, number]; // [lebar, tinggi]
}

function LandmarkSpheres({ landmarks, planeSize }: LandmarkSpheresProps) {
  const [width, height] = planeSize;

  // Konversi landmark normal ke koordinat Three.js
  const points = landmarks.map(({ x, y, z }, index) => {
    // Map x dari [0,1] ke [-width/2, width/2]
    const posX = (x - 0.5) * width;

    // Map y dari [0,1] ke [height/2, -height/2] (invert sumbu Y)
    const posY = (0.5 - y) * height;

    // Sedikit di depan plane untuk mencegah z-fighting
    const posZ = 0.01;

    return new Vector3(posX, posY, posZ);
  });

  return (
    <>
      {points.map((point, index) => (
        <mesh
          key={index}
          position={[point.x, point.y, point.z]}
          renderOrder={1}
        >
          <sphereGeometry args={[0.005, 16, 16]} />{" "}
          {/* Ukuran ditingkatkan untuk visibilitas */}
          <meshBasicMaterial color="lime" />
        </mesh>
      ))}
    </>
  );
}

export default SkinToneFinderScene;
