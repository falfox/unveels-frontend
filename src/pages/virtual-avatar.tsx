import { useEffect, useRef, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import ModelSceneWeb from "../components/assistant/web/model-scene-web";
import { makeSpeech, talkingAvatarHost } from "../utils/virtualAssistantUtils";
import { BlendData } from "../types/blendData";

export function VirtualAvatar() {
  const [speak, setSpeak] = useState(false);
  const [text, setText] = useState("");
  const [playing, setPlaying] = useState(false);
  const [audioSource, setAudioSource] = useState<string | null>(null);
  const [language, setLanguage] = useState("en-US");

  const [blendshape, setBlendshape] = useState<BlendData[]>([]);

  const audioPlayer = useRef<ReactAudioPlayer>(null);

  // Fungsi untuk menerima data dari Flutter
  const receiveTextAndLanguage = async (
    incomingText: string,
    incomingLanguage: string,
  ) => {
    console.log("Data received from Flutter:", incomingText, incomingLanguage);

    const audioSrc = await makeSpeech(incomingText, incomingLanguage);

    setTimeout(() => {
      setAudioSource(`${talkingAvatarHost}${audioSrc.data.filename}`);
      setBlendshape(audioSrc.data.blendData);
      if ((window as any).flutter_inappwebview) {
        (window as any).flutter_inappwebview
          .callHandler("isSpeak", "true")
          .then((result: any) => {
            console.log("Flutter responded with:", result);
          })
          .catch((error: any) => {
            console.error("Error calling Flutter handler:", error);
          });
      }
      setSpeak(true);
    }, 1000);
  };

  useEffect(() => {
    console.log("VirtualAvatar component is mounted");

    (window as any).receiveTextAndLanguage = receiveTextAndLanguage;

    return () => {
      console.log("Cleanup: removing receiveTextAndLanguage from window");
      (window as any).receiveTextAndLanguage = undefined;
    };
  }, []);

  function playerEnded() {
    setAudioSource(null);
    setSpeak(false);
    setPlaying(false);
  }

  function playerReady() {
    audioPlayer.current?.audioEl.current?.play();
    setPlaying(true);
  }

  return (
    <div className="relative mx-auto flex h-full min-h-dvh w-full flex-col bg-[linear-gradient(180deg,#000000_0%,#0F0B02_41.61%,#47330A_100%)]">
      <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden">
        <ModelSceneWeb
          blendshape={blendshape}
          speak={speak}
          playing={playing}
        />
        <ReactAudioPlayer
          src={audioSource ?? undefined}
          ref={audioPlayer}
          onEnded={playerEnded}
          onCanPlayThrough={playerReady}
          onError={(e) => {
            console.error("Audio Playback Error:", e);
            console.log(
              "Audio Source:",
              audioSource || "No audio source provided",
            );
          }}
        />
      </div>
    </div>
  );
}
