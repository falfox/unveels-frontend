import { useWavesurfer } from "@wavesurfer/react";
import clsx from "clsx";
import {
  ChevronLeft,
  CirclePlay,
  Mic,
  PauseCircle,
  PlayCircle,
  Send,
  StopCircle,
  Trash,
  X,
} from "lucide-react";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
import { usePage } from "../App";
import SarahAvatar from "../assets/sarah-avatar.png";
import SwirlyBackground from "../assets/swirly-background.svg";
import { Icons } from "../components/icons";
import { RecordDialog } from "../components/record-dialog";
import {
  CameraProvider,
  useCamera,
} from "../components/recorder/recorder-context";
import { useRecordingControls } from "../hooks/useRecorder";

export function VirtulAssistant() {
  const [started, setStarted] = useState(false);
  const [screen, setScreen] = useState<"vocal" | "text" | "audio" | null>(null);

  return (
    <CameraProvider>
      <div className="h-full min-h-dvh w-full overflow-hidden bg-[linear-gradient(180deg,#47330A_0%,#0F0B02_58.39%,#000000_100%)]">
        {started ? (
          screen === "vocal" ? (
            <VocalConnectionScreen
              onBack={() => {
                setScreen(null);
              }}
            />
          ) : screen === "text" ? (
            <TextConnectionScreen
              onBack={() => {
                setScreen(null);
              }}
            />
          ) : screen === "audio" ? (
            <AudioConnectionScreen
              onBack={() => {
                setScreen(null);
              }}
            />
          ) : (
            <MainContent
              onBack={() => {
                setStarted(false);
              }}
              setScreen={(screen) => {
                setScreen(screen);
              }}
            />
          )
        ) : (
          <WelcomeScreen
            onStarted={() => {
              setStarted(true);
            }}
          />
        )}
      </div>
    </CameraProvider>
  );
}

function WelcomeScreen({ onStarted }: { onStarted: () => void }) {
  return (
    <div className="relative flex flex-col w-full h-full mx-auto min-h-dvh">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="w-[1700px] -translate-x-[350px] -translate-y-[900px]">
          <img
            src={SwirlyBackground}
            alt="Assistant"
            className="object-cover h-auto"
          />
        </div>
      </div>
      <TopNavigation />
      <div className="flex flex-col items-start justify-center flex-1 h-full px-4">
        <Icons.logo className="size-20" />

        <p className="text-[2.125rem] text-white">
          Welcome to{" "}
          <span className="inline-block bg-[linear-gradient(90deg,#CA9C43_36.41%,#916E2B_46.74%,#6A4F1B_58.8%,#473209_74.11%)] bg-clip-text text-transparent">
            Sarah
          </span>
          , Your Virtual Shopping Assistant
        </p>

        <p className="pt-4 text-white">
          Hello and welcome! I’m Sarah, here to assist you with all your
          shopping needs.
        </p>
      </div>

      <div className="w-full px-8 pb-14">
        <RecordDialog
          onConfirm={() => {
            onStarted();
          }}
        >
          <button
            type="button"
            className="flex w-full items-center justify-center rounded bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)] p-4 text-white"
          >
            Start
          </button>
        </RecordDialog>
      </div>
    </div>
  );
}

function VocalConnectionScreen({ onBack }: { onBack: () => void }) {
  const [recording, setRecording] = useState(false);
  return (
    <div className="relative mx-auto flex h-full min-h-dvh w-full flex-col bg-[linear-gradient(180deg,#000000_0%,#0F0B02_41.61%,#47330A_100%)]">
      <div className="absolute inset-0 flex justify-center overflow-hidden pointer-events-none">
        <img
          src={SarahAvatar}
          alt="Assistant"
          className="h-2/3 w-full bg-[#D9D9D9] object-cover"
        />
      </div>

      {/* <div className="h-1/3 shrink-0"> */}
      {/* </div> */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col h-1/3">
        <div className="flex-1 p-4 text-xl text-white">
          Hi Sarah, I'm looking for a gift set of luxury skincare products for
          my friend's birthday. Could you recommend some options that include
          moisturizer and serum? Also, are there any special discounts available
          right now?
        </div>

        <div className="relative overflow-hidden rounded-t-3xl bg-black/25 shadow-[inset_0px_1px_0px_0px_#FFFFFF40] backdrop-blur-3xl">
          <div className="pointer-events-none absolute inset-x-0 -top-[116px] flex justify-center">
            <BleedEffect className="h-48" />
          </div>
          <div className="flex items-center justify-around w-full max-w-lg py-2 mx-auto">
            <button type="button" className="rounded-full bg-[#CA9C43] p-3">
              <Icons.keyboard className="text-white size-6" />
            </button>

            {recording ? (
              <button
                type="button"
                className="relative grid size-28 place-items-center [&>*]:col-start-1 [&>*]:row-start-1"
                onClick={() => {
                  setRecording(false);
                }}
              >
                <div className="size-28 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.0175)_100%)] backdrop-blur-3xl"></div>
                <div className="size-20 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1925)_100%)] backdrop-blur-md"></div>
                <div className="size-14 rounded-full border border-white/50 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1925)_100%)]"></div>
                <div className="relative size-9 rounded-full bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)]"></div>
                <Icons.soundwave className="relative text-white size-9" />
              </button>
            ) : (
              <button
                type="button"
                className="relative grid size-28 place-items-center [&>*]:col-start-1 [&>*]:row-start-1"
                onClick={() => {
                  setRecording(true);
                }}
              >
                <div className="size-28 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0.0175)_100%)] backdrop-blur-3xl"></div>
                <div className="size-20 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(206,206,206,0)_0%,rgba(40,40,40,0.1925)_100%)] backdrop-blur-md"></div>
                <div className="size-14 rounded-full border border-white/50 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(206,206,206,0)_0%,rgba(40,40,40,0.1925)_100%)]"></div>
                <div className="relative size-9 rounded-full bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)]"></div>
                <Icons.microphone className="relative text-white size-6" />
              </button>
            )}

            <button
              type="button"
              className="rounded-full border border-white/10 bg-[#171717] p-3"
            >
              <X className="text-white size-6" />
            </button>
          </div>
        </div>
      </div>

      <TopNavigation onBack={onBack} />
    </div>
  );
}

const messages = [
  {
    id: 1,
    text: "Hi Sarah! I'm interested in finding a statement necklace to pair with an evening gown. Do you have any recommendations?",
    sender: "user",
  },
  {
    id: 2,
    text: "Hello! I'd be delighted to help you find the perfect statement necklace. We have a stunning collection that complements evening gowns beautifully. Are you looking for a specific color or style?",
    sender: "agent",
  },
  { id: 3, type: "audio", sender: "user" },
  {
    id: 4,
    text: "Here are a few options:\n1. Golden Elegance: A bold, modern necklace with intricate patterns.\n2. Luxe Links: A sleek design featuring interlocking gold loops.\n3. Glamour Gleam: A contemporary piece with a mix of gold and crystal accents.",
    sender: "agent",
  },
  {
    id: 5,
    text: "Would you like to see more details or make a purchase?",
    sender: "agent",
  },
  {
    id: 6,
    text: "I love the sound of the Golden Elegance! Can you show me more details?",
    sender: "user",
  },
  {
    id: 7,
    text: "Here's a closer look at the Golden Elegance necklace, including pricing and availability. You can add it to your cart whenever you're ready.",
    sender: "agent",
  },
  {
    id: 8,
    type: "product",
    name: "Tom Ford Item name Tom Ford",
    price: "$15",
    originalPrice: "$23",
    image: "https://picsum.photos/id/237/200/300",
    sender: "agent",
  },
];

function TextConnectionScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative mx-auto flex h-dvh w-full flex-col bg-[linear-gradient(180deg,#000000_0%,#0F0B02_41.61%,#47330A_100%)]">
      <main className="flex-1 p-4 pt-20 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <MessageItem message={message} />
        ))}
      </main>

      <footer className="relative overflow-hidden rounded-t-3xl bg-black/25 shadow-[inset_0px_1px_0px_0px_#FFFFFF40] backdrop-blur-3xl">
        <div className="pointer-events-none absolute inset-x-0 -top-[116px] flex justify-center">
          <BleedEffect className="h-48" />
        </div>
        <div className="mx-auto flex w-full max-w-xl items-center space-x-2.5 rounded-full px-4 py-5 lg:space-x-20">
          <UserInput />

          <button
            type="button"
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)]"
          >
            <Send className="w-6 h-6 text-white" />
          </button>
        </div>
      </footer>

      <TopNavigation onBack={onBack} />
    </div>
  );
}

function MessageItem({
  message,
}: {
  message:
    | {
        id: number;
        text: string;
        sender: string;
        type?: undefined;
        name?: undefined;
        price?: undefined;
        originalPrice?: undefined;
        image?: undefined;
      }
    | {
        id: number;
        type: string;
        sender: string;
        text?: undefined;
        name?: undefined;
        price?: undefined;
        originalPrice?: undefined;
        image?: undefined;
      }
    | {
        id: number;
        type: string;
        name: string;
        price: string;
        originalPrice: string;
        image: string;
        sender: string;
        text?: undefined;
      };
}) {
  return (
    <div
      key={message.id}
      className={clsx("flex items-end", {
        "justify-end": message.sender === "user",
        "justify-start": message.sender !== "user",
      })}
    >
      {message.sender === "agent" && (
        <img
          alt="Agent"
          className="mr-2 rounded-full size-14"
          src={SarahAvatar}
        />
      )}
      <div
        className={clsx(
          "max-w-[60%] rounded-3xl text-white",
          {
            "rounded-br-none bg-[linear-gradient(90deg,rgba(202,156,67,0.2)_0%,rgba(145,110,43,0.2)_27.4%,rgba(106,79,27,0.2)_59.4%,rgba(71,50,9,0.2)_100%)]":
              message.sender === "user",
            "rounded-bl-none bg-[linear-gradient(90deg,rgba(202,156,67,0.5)_0%,rgba(145,110,43,0.5)_27.4%,rgba(106,79,27,0.5)_59.4%,rgba(71,50,9,0.5)_100%)]":
              message.sender !== "user",
          },
          [message.type === "audio" ? "px-3" : "p-3"],
          [message.type === "product" ? "max-w-fit px-5" : ""],
        )}
      >
        {message.type === "audio" ? (
          <AudioWave url="/public/audio/example.mp3" />
        ) : message.type === "product" ? (
          <div className="flex w-[115px] flex-col rounded-lg">
            <img
              alt={message.name}
              className="object-cover w-full rounded-md aspect-square"
              src={message.image}
            />
            <div className="line-clamp-2 py-2 text-left text-[0.625rem] font-semibold text-white">
              {message.name}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[0.5rem] text-white/60">Brand Name</p>
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
        <div className="ml-2 rounded-full size-14 bg-white/20" />
      )}
    </div>
  );
}

function SuggestedGifts() {
  return (
    <div className="w-full space-y-4 bg-gradient-to-b from-[#1B1404] to-[#2C1F06] py-4">
      <h3 className="px-8 text-2xl font-bold text-white">Suggested Gifts</h3>
      <div className="flex items-center px-8 space-x-3 overflow-x-auto no-scrollbar">
        {Array.from({ length: 13 }).map((_, index) => (
          <div
            className="flex w-[115px] shrink-0 flex-col rounded-lg"
            key={index}
          >
            <img
              className="aspect-[115/80] w-full rounded-md object-cover"
              src="https://picsum.photos/id/237/200/300"
            />
            <div className="line-clamp-2 py-2 text-left text-[0.625rem] font-semibold text-white">
              Item name Tom Ford Item name Tom Ford
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[0.5rem] text-white/60">Brand Name</p>
              <div className="flex flex-wrap items-center justify-end gap-x-1">
                <span className="text-[0.625rem] font-bold text-white">
                  $15
                </span>
                <span className="text-[0.5rem] text-white/50 line-through">
                  $23
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AudioConnectionScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative mx-auto flex h-full min-h-dvh w-full flex-col bg-[linear-gradient(180deg,#000000_0%,#0F0B02_41.61%,#47330A_100%)]">
      <div className="absolute inset-0 flex justify-center overflow-hidden pointer-events-none">
        <img
          src={SarahAvatar}
          alt="Assistant"
          className="h-1/2 w-full bg-[#D9D9D9] object-cover"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col h-1/2">
        <SuggestedGifts />
        <div className="flex-1 p-4 space-y-4 overflow-y-auto text-xl text-white">
          {messages.map((message) => (
            <MessageItem message={message} />
          ))}
        </div>

        <div className="relative overflow-hidden rounded-t-3xl bg-black/25 shadow-[inset_0px_1px_0px_0px_#FFFFFF40] backdrop-blur-3xl">
          <div className="pointer-events-none absolute inset-x-0 -top-[116px] flex justify-center">
            <BleedEffect className="h-48" />
          </div>
          <div className="mx-auto flex w-full max-w-xl items-center space-x-2.5 rounded-full px-4 py-5 lg:space-x-20">
            <UserInput />

            <button
              type="button"
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)]"
            >
              <Send className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      <TopNavigation onBack={onBack} />
    </div>
  );
}

const updateProgress = (time: number) => {
  // time will be in milliseconds, convert it to mm:ss format
  const formattedTime = [
    Math.floor((time % 3600000) / 60000), // minutes
    Math.floor((time % 60000) / 1000), // seconds
  ]
    .map((v) => (v < 10 ? "0" + v : v))
    .join(":");

  return formattedTime;
};

function UserInput() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [recordingState, setRecordingState] = useState<
    "idle" | "recording" | "paused"
  >("idle");

  const [progressMs, setProgressMs] = useState(0);

  const plugins = useMemo(
    () => [
      RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: false,
      }),
    ],
    [],
  );
  const { wavesurfer } = useWavesurfer({
    container: containerRef,
    height: 48,
    waveColor: "rgb(255, 255, 255)",
    progressColor: "#CA9C43",

    // Set a bar width
    barWidth: 2,
    // Optionally, specify the spacing between bars
    barGap: 1,
    // And the bar radius
    barRadius: 2,
    cursorWidth: 0,
  });

  const record = plugins[0];

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.registerPlugin(record);
      record.on("record-end", (blob) => {
        console.log("Recording ended", blob);
        setRecordingState("idle");
        // setProgressMs(0);
      });

      record.on("record-start", () => {
        console.log("Recording started");
        setRecordingState("recording");
      });

      record.on("record-pause", (blob) => {
        console.log("Recording paused", blob);
        setRecordingState("paused");
      });

      record.on("record-resume", () => {
        console.log("Recording resumed");
        setRecordingState("recording");
      });

      record.on("record-progress", (time) => {
        console.log("Recording progress", time);

        setProgressMs(time);
      });

      return () => {
        record.destroy();
      };
    }
  }, [wavesurfer]);

  return (
    <div className="relative flex justify-between w-full p-px">
      <div
        className="absolute inset-0 border border-transparent rounded-full pointer-events-none"
        style={
          {
            background: `linear-gradient(90deg, #CA9C43 0%, #916E2B 27.4%, #6A4F1B 59.4%, #473209 100%)`,
            "-webkit-mask": `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
            mask: `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
            "-webkit-mask-composite": "destination-out",
            "mask-composite": "exclude",
          } as CSSProperties
        }
      />
      {recordingState !== "idle" ? (
        <div className="flex items-center mx-2 space-x-2">
          <button
            type="button"
            onClick={() => {
              record.stopRecording();
            }}
          >
            <Trash className="text-white size-6" />
          </button>

          <span className="text-white">{updateProgress(progressMs)}</span>
        </div>
      ) : null}
      <input
        className={clsx(
          "w-full rounded-full bg-black px-3 py-4 text-white placeholder-gray-400",
          { invisible: recordingState !== "idle" },
        )}
        placeholder="Ask me anything..."
        type="text"
      />

      <div
        className={clsx(
          "pointer-events-none absolute inset-0 flex items-center justify-center rounded-full pl-20 pr-14",
          {
            invisible: recordingState === "idle",
          },
        )}
      >
        <div ref={containerRef} className="w-48 px-4 lg:w-64" />
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full">
        <button
          type="button"
          onClick={() => {
            if (recordingState === "idle") {
              record.startRecording();
            } else if (recordingState === "recording") {
              record.pauseRecording();
            } else {
              record.resumeRecording();
            }
          }}
        >
          {recordingState === "idle" ? (
            <Mic className="text-gray-400 size-6" />
          ) : recordingState === "recording" ? (
            <PauseCircle className="text-red-600 size-6" />
          ) : (
            <CirclePlay className="text-white size-6" />
          )}
        </button>
      </div>
    </div>
  );
}

function BleedEffect(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 406 152" {...props}>
      <g filter="url(#filter0_f_9846_588)">
        <ellipse cx="203" cy="76" fill="#342112" rx="143" ry="16" />
      </g>
      <g filter="url(#filter1_f_9846_588)">
        <path
          fill="#CA9C43"
          d="M346 85.563C346 91.327 281.977 93 203 93S60 91.327 60 85.563c0-5.765 64.023.438 143 .438s143-6.203 143-.438Z"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_9846_588"
          width="406"
          height="152"
          x="0"
          y="0"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_9846_588"
            stdDeviation="30"
          />
        </filter>
        <filter
          id="filter1_f_9846_588"
          width="306"
          height="29.891"
          x="50"
          y="73.109"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_9846_588"
            stdDeviation="5"
          />
        </filter>
      </defs>
    </svg>
  );
}

function MainContent({
  setScreen,
  onBack,
}: {
  setScreen: (screen: "vocal" | "text" | "audio") => void;
  onBack: () => void;
}) {
  return (
    <div className="relative flex flex-col w-full h-full pt-20 mx-auto bg-black min-h-dvh">
      <RecorderStatus />
      <TopNavigation onBack={onBack} />
      <div className="font-extrabold text-center text-white">
        How would you like to communicate with me today
      </div>

      <div className="space-y-4 p-3.5">
        <div className="rounded-3xl bg-[linear-gradient(90deg,rgba(202,156,67,0.2)_0%,rgba(145,110,43,0.2)_27.4%,rgba(106,79,27,0.2)_59.4%,rgba(71,50,9,0.2)_100%)] shadow-[4px_4px_15px_0px_#FFFFFF1A_inset]">
          <div className="flex flex-col w-full py-6 space-y-5 text-white px-7 lg:flex-row lg:px-16 lg:py-14">
            <div className="w-full space-y-5 lg:space-y-6">
              <div className="flex items-center space-x-2">
                <Icons.voiceDevices className="size-8 shrink-0" />
                <h3 className="text-2xl font-bold">Vocal Connection</h3>
              </div>
              <p>
                Speak freely, and I'll respond in real-time. Let's talk Speech
                to Speech!
              </p>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)] px-4 py-2.5 text-sm text-white lg:text-base"
              onClick={() => {
                setScreen("vocal");
              }}
            >
              Start Video Chat
            </button>
          </div>
        </div>
        <div className="rounded-3xl bg-[linear-gradient(90deg,rgba(202,156,67,0.2)_0%,rgba(145,110,43,0.2)_27.4%,rgba(106,79,27,0.2)_59.4%,rgba(71,50,9,0.2)_100%)] shadow-[4px_4px_15px_0px_#FFFFFF1A_inset]">
          <div className="flex flex-col w-full py-6 space-y-5 text-white px-7 lg:flex-row lg:px-16 lg:py-14">
            <div className="w-full space-y-5 lg:space-y-6">
              <div className="flex items-center space-x-2">
                <Icons.chatMessages className="size-8 shrink-0" />
                <h3 className="text-2xl font-bold">Text Connection</h3>
              </div>
              <p>
                Prefer typing? Chat with me directly using text. I'm here to
                help!
              </p>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)] px-4 py-2.5 text-sm text-white lg:text-base"
              onClick={() => {
                setScreen("text");
              }}
            >
              Start Text Chat
            </button>
          </div>
        </div>
        <div className="rounded-3xl bg-[linear-gradient(90deg,rgba(202,156,67,0.2)_0%,rgba(145,110,43,0.2)_27.4%,rgba(106,79,27,0.2)_59.4%,rgba(71,50,9,0.2)_100%)] shadow-[4px_4px_15px_0px_#FFFFFF1A_inset]">
          <div className="flex flex-col w-full py-6 space-y-5 text-white px-7 lg:flex-row lg:px-16 lg:py-14">
            <div className="w-full space-y-5 lg:space-y-6">
              <div className="flex items-center space-x-2">
                <Icons.userVoice className="size-8 shrink-0" />
                <h3 className="text-2xl font-bold">Audible Assistance</h3>
              </div>
              <p>
                Prefer typing? Chat with me directly using text. I'm here to
                help!
              </p>
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)] px-4 py-2.5 text-sm text-white lg:text-base"
              onClick={() => {
                setScreen("audio");
              }}
            >
              Start Audio Response
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopNavigation({ onBack }: { onBack?: () => void }) {
  const { setPage } = usePage();

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 [&_button]:pointer-events-auto">
      <div className="flex flex-col gap-4">
        <button
          type="button"
          className="flex items-center justify-center overflow-hidden rounded-full size-8 bg-black/25 backdrop-blur-3xl"
          onClick={() => {
            onBack?.();
          }}
        >
          <ChevronLeft className="text-white size-6" />
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <button
          type="button"
          className="flex items-center justify-center overflow-hidden rounded-full size-8 bg-black/25 backdrop-blur-3xl"
          onClick={() => {
            setPage(null);
          }}
        >
          <X className="text-white size-6" />
        </button>
      </div>
    </div>
  );
}

function RecorderStatus() {
  const { isRecording, formattedTime, handleStartPause, handleStop, isPaused } =
    useRecordingControls();
  const { finish } = useCamera();

  return (
    <div className="absolute inset-x-0 flex items-center justify-center gap-4 top-5">
      <button
        className="flex items-center justify-center size-8"
        onClick={handleStartPause}
      >
        {isPaused ? (
          <CirclePlay className="text-white size-6" />
        ) : isRecording ? (
          <PauseCircle className="text-white size-6" />
        ) : null}
      </button>
      <span className="relative flex size-4">
        {isRecording ? (
          <span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
        ) : null}
        <span className="relative inline-flex bg-red-500 rounded-full size-4"></span>
      </span>
      <div className="font-serif text-white">{formattedTime}</div>
      <button
        className="flex items-center justify-center size-8"
        onClick={
          isRecording
            ? () => {
                handleStop();
                finish();
              }
            : handleStartPause
        }
      >
        {isRecording || isPaused ? (
          <StopCircle className="text-white size-6" />
        ) : (
          <CirclePlay className="text-white size-6" />
        )}
      </button>
    </div>
  );
}

function AudioWave({ url }: { url: string }) {
  const containerRef = useRef(null);

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    height: 48,
    waveColor: "rgb(255, 255, 255)",
    progressColor: "#CA9C43",
    url,

    // Set a bar width
    barWidth: 2,
    // Optionally, specify the spacing between bars
    barGap: 1,
    // And the bar radius
    barRadius: 2,
    cursorWidth: 0,
  });

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  return (
    <div className="flex items-center w-full space-x-1">
      <button type="button" onClick={onPlayPause}>
        {isPlaying ? (
          <PauseCircle className="size-6" />
        ) : (
          <PlayCircle className="size-6" />
        )}
      </button>
      <div ref={containerRef} className="w-32 lg:w-96" />
    </div>
  );
}
