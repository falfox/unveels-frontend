import {
  BleedEffect,
  LoadingChat,
  MessageItem,
  TopNavigation,
  UserInput,
} from "../../components/assistant";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_BARD_API_KEY);

interface Chat {
  id: number;
  text: string;
  sender: "user" | "agent";
  mode: "voice-connection" | "text-connection" | "audio-connection";
  timestamp: string;
}

const TextConnectionScreen = ({ onBack }: { onBack: () => void }) => {
  const getCurrentTimestamp = (): string => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const [messages, setMessages] = useState<Chat[]>([
    {
      id: 1,
      text: "Hello! I am Sarah. How can I assist you today?",
      sender: "agent",
      mode: "text-connection",
      timestamp: getCurrentTimestamp(),
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const getResponse = async (userMsg: string | Blob) => {
    if (typeof userMsg === "string" && !userMsg.trim()) {
      console.error("Prompt can't be empty.");
      return;
    }

    const timestamp = getCurrentTimestamp();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: userMsg instanceof Blob ? "Audio Message" : userMsg,
        sender: "user",
        mode: "text-connection",
        timestamp,
      },
    ]);

    if (typeof userMsg === "string") {
      setLoading(true);
    }

    const systemPrompt = `Anda adalah asisten virtual yang ahli dalam produk.`;
    const conversationHistory = [
      systemPrompt,
      ...messages.map((message) =>
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
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: responseText,
          sender: "agent",
          mode: "text-connection",
          timestamp,
        },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      console.error("Failed to fetch response from AI.");
    } finally {
      setLoading(false);
    }
  };

  const onSendMessage = (message: string) => {
    getResponse(message);
    setMsg("");
  };

  return (
    <div className="relative mx-auto flex h-dvh w-full flex-col bg-[linear-gradient(180deg,#000000_0%,#0F0B02_41.61%,#47330A_100%)]">
      <main className="flex-1 space-y-4 overflow-y-auto p-4 pt-20">
        {messages.map((message) => (
          <MessageItem message={message} />
        ))}
        {loading && <LoadingChat />}
      </main>

      <footer className="relative overflow-hidden rounded-t-3xl bg-black/25 shadow-[inset_0px_1px_0px_0px_#FFFFFF40] backdrop-blur-3xl">
        <div className="pointer-events-none absolute inset-x-0 -top-[116px] flex justify-center">
          <BleedEffect className="h-48" />
        </div>
        <div className="mx-auto flex w-full max-w-xl items-center space-x-2.5 rounded-full px-4 py-5 lg:space-x-20">
          <UserInput msg={msg} setMsg={setMsg} onSendMessage={onSendMessage} />
        </div>
      </footer>

      <TopNavigation onBack={onBack} />
    </div>
  );
};

export default TextConnectionScreen;
