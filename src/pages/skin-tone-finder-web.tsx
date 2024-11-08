import { Footer } from "../components/footer";
import { VideoScene } from "../components/recorder/recorder";
import { CameraProvider, useCamera } from "../context/recorder-context";
import { VideoStream } from "../components/recorder/video-stream";
import { SkinToneFinderScene } from "../components/skin-tone-finder-scene/skin-tone-finder-scene";
import { SkinColorProvider } from "../components/skin-tone-finder-scene/skin-color-context";
import { MakeupProvider } from "../context/makeup-context";
import { InferenceProvider } from "../context/inference-context";

export function SkinToneFinderWeb() {
  return (
    <CameraProvider>
      <InferenceProvider>
        <SkinColorProvider>
          <MakeupProvider>
            <div className="h-full min-h-dvh">
              <Main />
            </div>
          </MakeupProvider>
        </SkinColorProvider>
      </InferenceProvider>
    </CameraProvider>
  );
}

function Main() {
  const { criterias } = useCamera();

  return (
    <div className="relative mx-auto h-full min-h-dvh w-full bg-black">
      <div className="absolute inset-0">
        <VideoStream debugMode={false} />
        <SkinToneFinderScene />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
          }}
        ></div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0">
        {criterias.isCaptured ? "" : <VideoScene />}
        <Footer />
      </div>
    </div>
  );
}
