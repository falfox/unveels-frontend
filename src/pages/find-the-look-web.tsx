import { useState } from "react";
import { FindTheLookMainScreen } from "../components/find-the-look/find-the-look-main-screen";
import { FindTheLookProvider } from "../context/find-the-look-context";
import { CameraProvider, useCamera } from "../context/recorder-context";
import { SkinAnalysisProvider } from "../context/skin-analysis-context";
import { FindTheLook } from "./find-the-look";
import { FindTheLookScene } from "../components/find-the-look/find-the-look-scene";
import { VideoStream } from "../components/recorder/video-stream";
import { FindTheLookMainScreenWeb } from "../components/find-the-look/find-the-look-main-screen-web";
import { VideoScene } from "../components/recorder/recorder";
import { Footer } from "../components/footer";

export function FindTheLookWeb() {
  return (
    <CameraProvider>
      <SkinAnalysisProvider>
        <FindTheLookProvider>
          <div className="h-full min-h-dvh">
            <Main />
          </div>
        </FindTheLookProvider>
      </SkinAnalysisProvider>
    </CameraProvider>
  );
}

function Main() {
  const { criterias } = useCamera();
  const [selectionMade, setSelectionMade] = useState(false);

  // Fungsi ini akan dijalankan ketika pilihan sudah dibuat
  const handleSelection = () => {
    setSelectionMade(true);
  };

  return (
    <>
      {!selectionMade && (
        <FindTheLookMainScreenWeb onSelection={handleSelection} />
      )}
      {selectionMade && (
        <div className="relative mx-auto h-full min-h-dvh w-full bg-black">
          <div className="absolute inset-0">
            {criterias.isCaptured && criterias.capturedImage ? (
              <FindTheLookScene />
            ) : (
              <>
                <VideoStream />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
                    zIndex: 0,
                  }}
                ></div>
              </>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0">
            <VideoScene />
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}
