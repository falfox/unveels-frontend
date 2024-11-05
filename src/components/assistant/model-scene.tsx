import { Environment, Loader, OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Avatar from "./avatar";

interface ModelSceneProps {
  speak: boolean;
  text: string;
  playing: boolean;
  setAudioSource: (source: string | null) => void;
  setSpeak: (speak: boolean) => void;
}

const ModelScene = ({
  speak,
  text,
  playing,
  setAudioSource,
  setSpeak,
}: ModelSceneProps) => {
  return (
    <>
      <Canvas dpr={2}>
        <OrthographicCamera
          makeDefault
          zoom={1400}
          position={[0.06, 1.6, 1]}
          rotation={[0, 0.05, 0]}
        />

        <Suspense fallback={null}>
          <Environment
            background={false}
            files="/photo_studio_loft_hall_1k.hdr"
          />
        </Suspense>

        <Suspense fallback={null}>
          <Avatar
            avatar_url="/model.glb"
            speak={speak}
            text={text}
            playing={playing}
            setAudioSource={setAudioSource}
            setSpeak={setSpeak}
          />
        </Suspense>
      </Canvas>
      <Loader dataInterpolation={() => `Loading... please wait`} />
    </>
  );
};

export default ModelScene;
