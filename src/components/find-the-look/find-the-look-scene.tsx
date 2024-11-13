import { useEffect, useRef, useState } from "react";
import { useCamera } from "../../context/recorder-context";
import { FindTheLookCanvas } from "./find-the-look-canvas";
import { useFindTheLookContext } from "../../context/find-the-look-context";

export function FindTheLookScene() {
  const { criterias } = useCamera();
  const findTheLookCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState<HTMLImageElement | null>(null);
  const { setTab, setSection } = useFindTheLookContext();

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

  const handleLabelClick = (label: string | null, tab: string | null) => {
    // Check if Flutter's in-app web view is available, and call handler with the label and section (even if they are null)
    if ((window as any).flutter_inappwebview) {
      (window as any).flutter_inappwebview
        .callHandler(
          "getLabelTab",
          JSON.stringify({
            findTheLookLabelClick: label,
            findTheLookSection: tab,
          }),
        )
        .then((result: any) => {
          console.log("Flutter responded with:", result);
        })
        .catch((error: any) => {
          console.error("Error calling Flutter handler:", error);
        });
    }

    // Update state for `tab` and `section`, even if they are null
    setTab(label);
    setSection(tab);

    // Log the current values of label and tab (including null)
    console.log("Label:", label);
    console.log("Section:", tab);
  };

  return (
    <>
      {imageLoaded && (
        <div className="fixed inset-0 flex">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
              zIndex: 200, // Lebih rendah dari overlay canvas
              pointerEvents: "none", // Agar tidak menghalangi klik
            }}
          >
            {" "}
          </div>

          <canvas
            ref={findTheLookCanvasRef}
            className="absolute left-0 top-0 h-full w-screen"
            style={{ zIndex: 100 }}
          >
            {/* Komponen untuk menggambar gambar di overlay canvas */}
            <FindTheLookCanvas
              image={imageLoaded}
              canvasRef={findTheLookCanvasRef}
              onLabelClick={handleLabelClick}
            />
          </canvas>
        </div>
      )}
    </>
  );
}
