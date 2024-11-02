import { RecorderStatus } from "../components/assistant";
import { FindTheLookScene } from "../components/find-the-look/find-the-look-scene";
import { VideoScene } from "../components/recorder/recorder";
import {
  CameraProvider,
  useCamera,
} from "../components/recorder/recorder-context";
import { VideoStream } from "../components/recorder/video-stream";
import { TopNavigation } from "./skin-tone-finder";

export function FindTheLook() {
  return (
    <CameraProvider>
      <div className="h-full min-h-dvh">
        <Main />
      </div>
    </CameraProvider>
  );
}

function Main() {
  const { criterias } = useCamera();

  return (
    <>
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
        <RecorderStatus />
        <TopNavigation item={false} />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0">
          <BottomContent />
        </div>
      </div>
    </>
  );
}
function BottomContent() {
  const { criterias, setCriterias } = useCamera();

  return <VideoScene />;
}
