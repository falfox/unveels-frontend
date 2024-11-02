import { useEffect, useRef, useState } from "react";
import { useCamera } from "../recorder/recorder-context";
import { FindTheLookCanvas } from "./find-the-look-canvas";

export function FindTheLookScene() {
  const { criterias } = useCamera();
  const findTheLookCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState<HTMLImageElement | null>(null);

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

  return (
    <>
      {imageLoaded && (
        <div className="fixed inset-0 flex">
          <canvas
            ref={findTheLookCanvasRef}
            className="pointer-events-none absolute left-0 top-0 h-full w-screen"
            style={{ zIndex: 50 }}
          >
            {/* Komponen untuk menggambar gambar di overlay canvas */}
            <FindTheLookCanvas
              image={imageLoaded}
              canvasRef={findTheLookCanvasRef}
            />
          </canvas>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
              zIndex: 60,
            }}
          ></div>
        </div>
      )}
    </>
  );
}
