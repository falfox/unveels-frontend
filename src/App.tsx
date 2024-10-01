import { CSSProperties, useState } from "react";
import { Icons } from "./components/icons";

import "./index.css";
import {
  ChevronDown,
  ChevronLeft,
  CirclePlay,
  Lightbulb,
  PauseCircle,
  Scan,
  ScanFace,
  StopCircle,
  X,
} from "lucide-react";
import { useRecordingControls } from "./hooks/useRecorder";

function App() {
  return (
    <div className="h-full min-h-dvh">
      <div className="relative mx-auto h-full min-h-dvh w-full max-w-2xl bg-pink-950">
        <div className="absolute inset-0">
          <img
            src={"https://picsum.photos/id/237/200/300"}
            alt="Model"
            className="h-dvh w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
            }}
          ></div>
        </div>
        <RecorderStatus />
        <TopNavigation />

        <Footer />
        <Sidebar />
      </div>
    </div>
  );
}

function ShadesSelector() {
  const shadeOptions = [
    {
      name: "Cooler",
      color: "#A37772",
    },
    {
      name: "Lighter",
      color: "#DF9F86",
    },
    {
      name: "Perfect Fit",
      color: "#B7775E",
    },
    {
      name: "Warmer",
      color: "#CB8B5E",
    },
    {
      name: "Darker",
      color: "#8F4F36",
    },
  ];

  const products = [
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
    {
      name: "Double Wear Stay-in-Place Foundation",
      brand: "Estée Lauder",
      price: 52,
      originalPrice: 60,
    },
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
    {
      name: "Tom Ford Item name Tom Ford",
      brand: "Brand name",
      price: 15,
      originalPrice: 23,
    },
  ];
  const [tab, setTab] = useState("matched" as "matched" | "other");
  const [selectedShade, setSelectedShade] = useState(shadeOptions[0].name);

  return (
    <div className="p-4">
      <div className="flex flex-col items-start gap-4">
        <div className="flex h-10 w-full items-center justify-between border-b border-gray-600 text-center">
          <button
            className={`h-10 grow border-b text-lg ${tab === "matched" ? "border-white text-white" : "border-transparent text-gray-500"}`}
            onClick={() => setTab("matched")}
          >
            Matched Shades
          </button>
          <div className="h-10 px-px py-2">
            <div className="h-full border-r border-white"></div>
          </div>
          <button
            className={`h-10 grow border-b text-lg ${tab === "other" ? "border-white text-white" : "border-transparent text-gray-500"}`}
            onClick={() => setTab("other")}
          >
            Other Shades
          </button>
        </div>
        <div className="inline-flex items-center gap-x-2 rounded-full border border-white px-2 py-1 text-white">
          <div className="size-3 rounded-full bg-[#D18B59]"></div>
          <span className="text-sm">Medium skin</span>
        </div>
        <div className="flex w-full min-w-0 py-2">
          {shadeOptions.map((option, index) => (
            <button
              key={index}
              className={`w-full border border-transparent px-4 py-2 text-xs text-white transition-all data-[selected=true]:scale-[1.15] data-[selected=true]:border-white`}
              data-selected={selectedShade === option.name}
              style={{
                background: option.color,
              }}
              onClick={() => setSelectedShade(option.name)}
            >
              {option.name}
            </button>
          ))}
        </div>
        <div className="w-full text-right">
          <button className="text-[0.625rem] text-white">View all</button>
        </div>
      </div>
      <div className="-mx-4 flex gap-4 overflow-x-auto">
        {products.map((product, index) => (
          <div key={index} className="rounded py-4 shadow first:pl-4">
            <div className="relative w-[110px]">
              <img
                src={"https://picsum.photos/id/237/200/300"}
                alt="Product"
                className="aspect-video rounded object-cover"
              />
            </div>
            <h3 className="line-clamp-2 py-2 text-[0.625rem] font-semibold text-white">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-[0.5rem] text-white/60">{product.brand}</p>
              <div className="flex items-center justify-between">
                <span className="pr-1 text-[0.625rem] font-bold text-white">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-[0.5rem] text-white/50 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecorderGuide() {
  return (
    <div className="select-none px-2 pb-4 text-center text-white">
      <p className="pb-9">
        Ensure it is a well-lit area with natural or bright artificial light
      </p>

      <div className="grid grid-cols-3 gap-5 text-xs text-white/50">
        <div className="flex items-center justify-between rounded-lg border border-dashed border-white/50 px-2.5 py-2">
          Face Position
          <ScanFace className="size-6" />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-white px-2.5 py-2 text-white [background:linear-gradient(90deg,_#CA9C43_0%,_#916E2B_27.4%,_#6A4F1B_59.4%,_#473209_100%);]">
          Lighting
          <Lightbulb className="size-6" />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-dashed border-white/50 px-2.5 py-2">
          Orientation
          <Scan className="size-6" />
        </div>
      </div>

      <button className="">
        <ChevronDown className="size-6 text-white" />
      </button>
    </div>
  );
}

function BottomContent() {
  // return <RecorderGuide />;
  return <ShadesSelector />;
}

function RecorderStatus() {
  const { isRecording, formattedTime, handleStartPause, handleStop, isPaused } =
    useRecordingControls();

  return (
    <div className="absolute inset-x-0 top-14 flex items-center justify-center gap-4">
      <button
        className="flex size-8 items-center justify-center"
        onClick={handleStartPause}
      >
        {isPaused ? (
          <CirclePlay className="size-6 text-white" />
        ) : isRecording ? (
          <PauseCircle className="size-6 text-white" />
        ) : null}
      </button>
      <span className="relative flex size-4">
        {isRecording ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
        ) : null}
        <span className="relative inline-flex size-4 rounded-full bg-red-500"></span>
      </span>
      <div className="font-serif text-white">{formattedTime}</div>
      <button
        className="flex size-8 items-center justify-center"
        onClick={isRecording ? handleStop : handleStartPause}
      >
        {isRecording || isPaused ? (
          <StopCircle className="size-6 text-white" />
        ) : (
          <CirclePlay className="size-6 text-white" />
        )}
      </button>
    </div>
  );
}

function TopNavigation() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 [&_button]:pointer-events-auto">
      <button className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-black/25 backdrop-blur-3xl">
        <ChevronLeft className="size-6 text-white" />
      </button>
      <div className="flex flex-col gap-4">
        <button className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-black/25 backdrop-blur-3xl">
          <X className="size-6 text-white" />
        </button>
        <div className="relative p-0.5">
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={
              {
                background: `linear-gradient(148deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.77) 100%) border-box`,
                "-webkit-mask": `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
                mask: `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
                "-webkit-mask-composite": "destination-out",
                "mask-composite": "exclude",
              } as CSSProperties
            }
          />
          <button className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-black/25 backdrop-blur-3xl">
            <Icons.flipCamera className="size-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="absolute inset-y-0 right-5 flex flex-col items-center justify-center">
      <div className="relative p-0.5">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={
            {
              background: `linear-gradient(148deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.77) 100%) border-box`,
              "-webkit-mask": `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
              mask: `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
              "-webkit-mask-composite": "destination-out",
              "mask-composite": "exclude",
            } as CSSProperties
          }
        />

        <div className="flex flex-col gap-4 rounded-full bg-black/25 px-1.5 py-2 backdrop-blur-md">
          <button className="">
            <Icons.camera className="size-6 text-white" />
          </button>
          <button className="">
            <Icons.flipCamera className="size-6 text-white" />
          </button>
          <button className="">
            <Icons.expand className="size-6 text-white" />
          </button>
          <button className="">
            <Icons.compare className="size-6 text-white" />
          </button>
          <button className="">
            <Icons.reset className="size-6 text-white" />
          </button>
          <button className="">
            <Icons.upload className="size-6 text-white" />
          </button>
          <button className="">
            <Icons.share className="size-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0">
      <BottomContent />
      <footer className="flex justify-center pb-4 text-white">
        <div className="mr-2 text-[0.5rem]">Powered by</div>
        <Icons.logo className="w-10" />
      </footer>
    </div>
  );
}

export default App;
