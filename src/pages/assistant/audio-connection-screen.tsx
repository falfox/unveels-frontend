import {
  BleedEffect,
  LoadingChat,
  MessageItem,
  ModelScene,
  SuggestedGifts,
  TopNavigation,
  UserInput,
} from "../../components/assistant";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactAudioPlayer from "react-audio-player";
import { useEffect, useRef, useState } from "react";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_BARD_API_KEY);

interface Chat {
  id: number;
  text: string;
  sender: "user" | "agent";
  mode: "voice-connection" | "text-connection" | "audio-connection";
  timestamp: string; // New property
}

const AudioConnectionScreen = ({ onBack }: { onBack: () => void }) => {
  const [suggestedProduct, setSuggestedProduct] = useState<boolean>(false);
  const [speak, setSpeak] = useState(false);
  const [audioSource, setAudioSource] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [msg, setMsg] = useState("");

  const [chats, setChats] = useState<Chat[]>([]);

  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);
  const audioPlayer = useRef<ReactAudioPlayer>(null);

  const getCurrentTimestamp = (): string => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getResponse = async (userMsg: string | Blob) => {
    if (typeof userMsg === "string" && !userMsg.trim()) {
      console.error("Prompt can't be empty.");
      return;
    }

    const timestamp = getCurrentTimestamp();

    setChats((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: userMsg instanceof Blob ? "Audio Message" : userMsg,
        sender: "user",
        mode: "audio-connection",
        timestamp,
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
      console.error("Error fetching AI response:", error);
      console.error("Failed to fetch response from AI.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const chatBox = document.querySelector(".chat-box");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    console.log(chats);
  }, [chats]);

  function playerEnded() {
    setAudioSource(null);
    setSpeak(false);
    setPlaying(false);
  }

  function playerReady() {
    audioPlayer.current?.audioEl.current?.play();
    setPlaying(true);
    const timestamp = getCurrentTimestamp();
    setChats((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        text: text,
        sender: "agent",
        mode: "audio-connection",
        timestamp,
      },
    ]);
  }

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

      <div className="absolute inset-x-0 bottom-0 flex h-1/2 flex-col bg-gradient-to-b from-[#1B1404] to-[#2C1F06]">
        {suggestedProduct ? <SuggestedGifts /> : null}
        <div className="chat-box flex-1 space-y-4 overflow-y-auto p-4 text-xl text-white">
          {chats.map((chat) => (
            <MessageItem key={chat.id} message={chat} />
          ))}
          {loading && <LoadingChat showAvatar={false} />}
        </div>

        <div className="relative overflow-hidden rounded-t-3xl bg-black/25 shadow-[inset_0px_1px_0px_0px_#FFFFFF40] backdrop-blur-3xl">
          <div className="pointer-events-none absolute inset-x-0 -top-[116px] flex justify-center">
            <BleedEffect className="h-48" />
          </div>
          <div className="mx-auto flex w-full max-w-xl items-center space-x-2.5 rounded-full px-4 py-5 lg:space-x-20">
            <UserInput
              msg={msg}
              setMsg={setMsg}
              onSendMessage={onSendMessage}
            />
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

export default AudioConnectionScreen;
