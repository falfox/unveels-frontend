import { useRef, useEffect } from "react";
import { useCamera } from "../context/recorder-context";

export function ScreenshotPreview() {
  const { criterias } = useCamera();
  const { screenshotImage } = criterias;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (screenshotImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = screenshotImage;

      img.onload = () => {
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.clearRect(0, 0, canvas.width, canvas.height); // Hapus canvas sebelumnya
          ctx.drawImage(img, 0, 0);
        }
      };
    }
  }, [screenshotImage]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute left-0 top-0 h-full w-screen"
      ></canvas>
    </>
  );
}
