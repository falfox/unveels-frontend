import React, { useEffect, useRef, useState } from "react";
import { useCamera } from "../recorder/recorder-context";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { Canvas, useThree } from "@react-three/fiber";
import { Texture, TextureLoader } from "three";
import { useSkinColor } from "./skin-color-context"; // Pastikan path ini benar
import FaceMesh from "../three/face-mesh"; // Pastikan path ini benar
import { Landmark } from "../../types/landmark";
import { extractSkinColor } from "../../utils/imageProcessing";

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

  const { setSkinColor } = useSkinColor();

  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

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

            const indices = [101, 50, 330, 280, 108, 69, 151, 337, 299];
            // Ekstrak warna kulit
            const extractedSkinColor = extractSkinColor(
              imageLoaded,
              normalizedLandmarks,
              indices,
              5,
            );
            setSkinColor(
              extractedSkinColor.hexColor,
              extractedSkinColor.skinType,
            );
          }
        } catch (error) {
          console.error("Gagal mendeteksi wajah:", error);
        }
      }
    };

    processImage();
  }, [imageLoaded, faceLandmarker, isLandmarkerReady]);

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
    </>
  );
}

export default SkinToneFinderScene;
