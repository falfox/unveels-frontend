import clsx from "clsx";
import SarahAvatar from "../../assets/sarah-avatar.png";
import AudioWave from "./audio-wave";

type Message =
  | {
      id: number;
      text: string;
      sender: string;
      type?: undefined;
      mode: "voice-connection" | "text-connection" | "audio-connection";
      timestamp: string;
    }
  | {
      id: number;
      type: "audio";
      sender: string;
      audioUrl: string;
      text?: undefined;
      timestamp: string;
    }
  | {
      id: number;
      type: "product";
      sender: string;
      name: string;
      price: string;
      originalPrice: string;
      image: string;
      brand: string;
      text?: undefined;
      timestamp: string;
    };

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  // Determine if the current message has mode 'audio-connection'
  const isAudioConnection =
    "mode" in message && message.mode === "audio-connection";

  // **Hide agent's message bubble during audio-connection**
  if (message.sender === "agent" && isAudioConnection) {
    return null;
  }

  return (
    <div
      className={clsx("flex flex-col", {
        "items-end": message.sender === "user",
        "items-start": message.sender !== "user" && !isAudioConnection,
        "items-center": message.sender !== "user" && isAudioConnection,
      })}
    >
      <div className="flex items-end">
        {/* Conditionally render the agent's avatar */}
        {message.sender === "agent" && !isAudioConnection && (
          <img
            alt="Agent"
            className="mr-2 size-14 rounded-full"
            src={SarahAvatar}
          />
        )}
        <div
          className={clsx(
            "relative max-w-[60%] rounded-3xl text-white",
            {
              "rounded-br-none bg-[linear-gradient(90deg,rgba(202,156,67,0.2)_0%,rgba(145,110,43,0.2)_27.4%,rgba(106,79,27,0.2)_59.4%,rgba(71,50,9,0.2)_100%)]":
                message.sender === "user",
              "rounded-bl-none bg-[linear-gradient(90deg,rgba(202,156,67,0.5)_0%,rgba(145,110,43,0.5)_27.4%,rgba(106,79,27,0.5)_59.4%,rgba(71,50,9,0.5)_100%)]":
                message.sender !== "user",
            },
            message.type === "audio" ? "px-3" : "p-3",
            message.type === "product" ? "max-w-fit px-5" : "",
          )}
        >
          {message.type === "audio" ? (
            <AudioWave url={message.audioUrl} />
          ) : message.type === "product" ? (
            <div className="flex w-[115px] flex-col rounded-lg">
              <img
                alt={message.name}
                className="aspect-square w-full rounded-md object-cover"
                src={message.image}
              />
              <div className="line-clamp-2 py-2 text-left text-[0.625rem] font-semibold text-white">
                {message.name}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[0.5rem] text-white/60">{message.brand}</p>
                <div className="flex flex-wrap items-center justify-end gap-x-1">
                  <span className="text-[0.625rem] font-bold text-white">
                    {message.price}
                  </span>
                  <span className="text-[0.5rem] text-white/50 line-through">
                    {message.originalPrice}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm">{message.text}</p>
          )}
        </div>
        {message.sender === "user" && (
          <div className="ml-2 size-14 rounded-full bg-white/20" />
        )}
      </div>
    </div>
  );
};

export default MessageItem;
