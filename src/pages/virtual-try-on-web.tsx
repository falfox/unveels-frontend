import { useEffect } from "react";
import { VirtualTryOnScene } from "../components/vto/virtual-try-on-scene";
import { AccesoriesProvider } from "../context/accesories-context";
import { MakeupProvider, useMakeup } from "../context/makeup-context";
import { CameraProvider } from "../context/recorder-context";

export function VirtualTryOnWeb() {
  return (
    <CameraProvider>
      <MakeupProvider>
        <AccesoriesProvider>
          <Main />
        </AccesoriesProvider>
      </MakeupProvider>
    </CameraProvider>
  );
}

function Main() {
  const {
    setShowLipColor,
    setLipColorMode,
    setLipColors,
    setShowLipliner,
    setLiplinerColor,
    setLiplinerPattern,
    setShowLipplumper,
    setLipplumperColor,
  } = useMakeup();

  useEffect(() => {
    // Handler untuk menerima pesan
    const handleMessage = (event: MessageEvent) => {
      console.log("Message received:", event);

      if (event.data) {
        try {
          const data = JSON.parse(event.data);
          console.log("Parsed data:", data);

          if (data.lipColor !== undefined) {
            setLipColors(data.lipColor);
          }

          if (data.showLipColor !== undefined) {
            setShowLipColor(data.showLipColor);
          }

          if (data.setLipColorMode) {
            setLipColorMode(data.setLipColorMode);
          }

          // lipliner

          if (data.showLipliner !== undefined) {
            setShowLipliner(data.showLipliner);
          }

          if (data.liplinerPattern !== undefined) {
            setLiplinerPattern(data.setLiplinerPattern);
          }

          if (data.liplinerColor !== undefined) {
            setLiplinerColor(data.liplinerColor);
          }

          // lipplumper
          if (data.showLipplumper !== undefined) {
            setShowLipplumper(data.showLipplumper);
          }

          if (data.lipplumperColor !== undefined) {
            setLipplumperColor(data.lipplumperColor);
          }
        } catch (error) {
          console.error("Error parsing message:", error); // Menampilkan error jika parsing gagal
        }
      } else {
        console.warn("No data received in message event");
      }
    };

    // Menambahkan event listener untuk menerima pesan
    window.addEventListener("message", handleMessage);

    // Membersihkan event listener saat komponen unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []); // Empty dependency array berarti hanya dijalankan saat mount dan unmount

  return (
    <div className="relative mx-auto h-full min-h-dvh w-full bg-black">
      <div className="absolute inset-0">
        <VirtualTryOnScene />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
          }}
        ></div>
      </div>
    </div>
  );
}
