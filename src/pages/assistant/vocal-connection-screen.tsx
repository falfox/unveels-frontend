import { useEffect, useRef, useState } from "react";
import { Icons } from "../../components/icons";
import {
  BleedEffect,
  LoadingChat,
  MessageItem,
  ModelScene,
  TopNavigation,
  UserInput,
  // UserInput,
} from "../../components/assistant";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactAudioPlayer from "react-audio-player";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import VoiceButton from "../../components/assistant/voice-button";
import { X } from "lucide-react";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_BARD_API_KEY);

interface Chat {
  id: number;
  text: string;
  sender: "user" | "agent";
}

const VocalConnectionScreen = ({ onBack }: { onBack: () => void }) => {
  const [recording, setRecording] = useState(false);
  const [showUserInput, setShowUserInput] = useState(false);

  const [speak, setSpeak] = useState(false);
  const [audioSource, setAudioSource] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [msg, setMsg] = useState("");

  const [chats, setChats] = useState<Chat[]>([]);

  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);
  const audioPlayer = useRef<ReactAudioPlayer>(null);
  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    getWebsiteVisits();
  }, []);

  useEffect(() => {
    setMsg(transcript);
  }, [transcript]);

  useEffect(() => {
    const chatBox = document.querySelector(".chat-box");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [chats]);

  const getResponse = async (userMsg: string | Blob) => {
    if (typeof userMsg === "string" && !userMsg.trim()) {
      console.error("Prompt can't be empty.");
      return;
    }

    setChats((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: userMsg instanceof Blob ? "Audio Message" : userMsg,
        sender: "user",
      },
    ]);

    if (typeof userMsg === "string") {
      setLoading(true);
    }

    const systemPrompt = `Anda adalah asisten virtual yang ahli dalam produk.`;
    const conversationHistory = [
      systemPrompt,
      ...chats.map((message) =>
        message.sender === "user"
          ? `User: ${message.text}`
          : `Agent: ${message.text}`,
      ),
    ].join("\n");

    const prompt = `${conversationHistory}\nUser: ${userMsg}\nAgent:`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      setText(responseText);
      setSpeak(true);
    } catch (error) {
      console.error("Failed to fetch response from AI.", error);
    } finally {
      setLoading(false);
    }
  };

  const getWebsiteVisits = async () => {
    const url =
      "https://counter10.p.rapidapi.com/?ID=prompt3&COLOR=red&CLABEL=blue";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "ede3c5163fmsh01abdacf07fd2b0p1c0e4bjsn1db1b15be576",
        "X-RapidAPI-Host": "counter10.p.rapidapi.com",
      },
    };
    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  function playerEnded() {
    setAudioSource(null);
    setSpeak(false);
    setPlaying(false);
  }

  function playerReady() {
    audioPlayer.current?.audioEl.current?.play();
    setPlaying(true);
    setChats((prev) => [
      ...prev,
      { id: Date.now() + 1, text: text, sender: "agent" },
    ]);
  }

  const startListening = () => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening();
    } else {
      console.error("Voice recognision not supported by browser.");
    }
  };
  const stopListening = () => {
    if (msg.trim()) {
      getResponse(msg);
    } else {
      console.error("Message cannot be empty.");
    }
    SpeechRecognition.stopListening();
  };

  const onSendMessage = (message: string) => {
    getResponse(message);
    setMsg("");
  };

  return (
    <div className="relative mx-auto flex h-full min-h-dvh w-full flex-col bg-[linear-gradient(180deg,#000000_0%,#0F0B02_41.61%,#47330A_100%)]">
      <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden">
        <ModelScene
          speak={speak}
          text={text}
          playing={playing}
          setAudioSource={setAudioSource}
          setSpeak={setSpeak}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-1/3 flex-col bg-gradient-to-b from-[#1B1404] to-[#2C1F06]">
        <div className="flex-1 p-4 text-xl text-white">
          Hi Sarah, I'm looking for a gift set of luxury skincare products for
          my friend's birthday. Could you recommend some options that include
          moisturizer and serum? Also, are there any special discounts available
          right now?
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xl text-white">
          {chats.map((chat) => (
            <MessageItem message={chat} />
          ))}
          {loading && <LoadingChat />}
        </div>

        <div className="relative overflow-hidden rounded-t-3xl bg-black/25 shadow-[inset_0px_1px_0px_0px_#FFFFFF40] backdrop-blur-3xl">
          <div className="pointer-events-none absolute inset-x-0 -top-[116px] flex justify-center">
            <BleedEffect className="h-48" />
          </div>
          <div className="mx-auto flex w-full max-w-lg items-center justify-around py-2">
            <button
              type="button"
              className={`mr-2 rounded-full p-3 ${
                showUserInput
                  ? "bg-[#CA9C43]"
                  : "border border-white/10 bg-[#171717]"
              }`}
              onClick={() => setShowUserInput(!showUserInput)}
            >
              <Icons.keyboard className="size-6 text-white" />
            </button>

            {showUserInput ? (
              <div className="flex h-28 w-full items-center justify-center">
                <UserInput
                  msg={msg}
                  setMsg={setMsg}
                  onSendMessage={onSendMessage}
                />
              </div>
            ) : (
              <>
                <VoiceButton
                  recording={recording}
                  setRecording={setRecording}
                  startListening={startListening}
                  stopListening={stopListening}
                />

                <button
                  type="button"
                  className="rounded-full border border-white/10 bg-[#171717] p-3"
                >
                  <X className="size-6 text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <ReactAudioPlayer
        src={audioSource ?? undefined}
        ref={audioPlayer}
        onEnded={playerEnded}
        onCanPlayThrough={playerReady}
      />

      <TopNavigation onBack={onBack} />
    </div>
  );
};

export default VocalConnectionScreen;
