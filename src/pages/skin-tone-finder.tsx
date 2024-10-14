import { CSSProperties, Fragment, useEffect, useState } from "react";
import { Icons } from "../components/icons";
import clsx from "clsx";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CirclePlay,
  Heart,
  PauseCircle,
  Plus,
  Share,
  StopCircle,
  X,
} from "lucide-react";
import { usePage } from "../App";
import { Footer } from "../components/footer";
import { VideoScene } from "../components/recorder/recorder";
import {
  CameraProvider,
  useCamera,
} from "../components/recorder/recorder-context";
import { VideoStream } from "../components/recorder/video-stream";
import { ShareModal } from "../components/share-modal";
import { useRecordingControls } from "../hooks/useRecorder";
import { useScrollContainer } from "../hooks/useScrollContainer";
import { SkinToneFinderScene } from "../components/skin-tone-finder-scene/skin-tone-finder-scene";
import {
  SkinColorProvider,
  useSkinColor,
} from "../components/skin-tone-finder-scene/skin-color-context";

export function SkinToneFinder() {
  return (
    <CameraProvider>
      <SkinColorProvider>
        <div className="h-full min-h-dvh">
          <Main />
        </div>
      </SkinColorProvider>
    </CameraProvider>
  );
}

function Main() {
  const { criterias } = useCamera();

  return (
    <div className="relative mx-auto h-full min-h-dvh w-full bg-black">
      <div className="absolute inset-0">
        <VideoStream debugMode={false} />
        <SkinToneFinderScene debugMode={false} />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
          }}
        ></div>
      </div>
      <RecorderStatus />
      <TopNavigation />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0">
        {criterias.isCaptured ? "" : <VideoScene />}
        <MainContent />
        <Footer />
      </div>
      <Sidebar />
    </div>
  );
}

function MainContent() {
  const [collapsed, setCollapsed] = useState(false);
  const { criterias } = useCamera();
  const [shareOpen, setShareOpen] = useState(false);

  if (criterias.isFinished) {
    return shareOpen ? (
      <ShareModal />
    ) : (
      <div className="flex space-x-5 px-5 pb-10 font-serif">
        <button
          type="button"
          className="h-10 w-full rounded border border-[#CA9C43] text-white"
        >
          Exit
        </button>
        <button
          type="button"
          className="h-10 w-full rounded bg-gradient-to-r from-[#CA9C43] to-[#92702D] text-white"
          onClick={() => setShareOpen(true)}
        >
          Share <Icons.share className="ml-4 inline-block size-6" />
        </button>
      </div>
    );
  }

  return (
    <>
      {collapsed ? null : <BottomContent />}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          {collapsed ? (
            <ChevronUp className="size-6 text-white" />
          ) : (
            <ChevronDown className="size-6 text-white" />
          )}
        </button>
      </div>
    </>
  );
}

function ShadesSelector() {
  const [tab, setTab] = useState("matched" as "matched" | "other");

  const activeClassNames =
    "border-white inline-block text-transparent bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)] bg-clip-text text-transparent";

  return (
    <div className="space-y-2 px-4">
      <div className="flex h-10 w-full items-center justify-between border-b border-gray-600 text-center">
        {["matched", "other"].map((shadeTab) => {
          const isActive = tab === shadeTab;
          return (
            <Fragment key={shadeTab}>
              <button
                key={shadeTab}
                className={`relative h-10 grow border-b text-lg ${
                  isActive
                    ? activeClassNames
                    : "border-transparent text-gray-500"
                }`}
                onClick={() => setTab(shadeTab as "matched" | "other")}
              >
                <span className={isActive ? "text-white/70 blur-sm" : ""}>
                  {shadeTab.charAt(0).toUpperCase() + shadeTab.slice(1)} Shades
                </span>
                {isActive ? (
                  <>
                    <div
                      className={clsx(
                        "absolute inset-0 flex items-center justify-center text-lg blur-sm",
                        activeClassNames,
                      )}
                    >
                      <span className="text-center text-lg">
                        {shadeTab.charAt(0).toUpperCase() + shadeTab.slice(1)}{" "}
                        Shades
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-center text-lg text-white/70">
                        {shadeTab.charAt(0).toUpperCase() + shadeTab.slice(1)}{" "}
                        Shades
                      </span>
                    </div>
                  </>
                ) : null}
              </button>
              {shadeTab === "matched" && (
                <div className="h-10 px-px py-2">
                  <div className="h-full border-r border-white"></div>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      {tab === "matched" ? <MatchedShades /> : <OtherShades />}
    </div>
  );
}

function MatchedShades() {
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

  const [selectedShade, setSelectedShade] = useState(shadeOptions[0].name);
  const { skinType, hexColor } = useSkinColor();

  return (
    <>
      <div className="flex flex-col items-start">
        <div className="inline-flex items-center gap-x-2 rounded-full border border-white/80 px-2 py-1 text-white/80">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: hexColor }}
          ></div>
          <span className="text-sm">{skinType}</span>
        </div>
        <div className="flex w-full min-w-0 pt-2">
          {shadeOptions.map((option, index) => (
            <button
              key={index}
              className={`w-full border border-transparent py-2 text-xs text-white transition-all data-[selected=true]:scale-[1.15] data-[selected=true]:border-white`}
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
          <button className="py-4 text-[0.625rem] text-white">View all</button>
        </div>

        <ProductList />
      </div>
    </>
  );
}

function OtherShades() {
  const shadeOptions = [
    "#342112",
    "#3D2B1F",
    "#483C32",
    "#4A2912",
    "#4F300D",
    "#5C4033",
    "#6A4B3A",
    "#7B3F00",
    "#8B4513",
  ];

  const tones = [
    {
      name: "Light Tones",
      color: "#FAD4B4",
    },
    {
      name: "Medium Tones",
      color: "#D18B59",
    },
    {
      name: "Dark Tones",
      color: "#4B2F1B",
    },
  ];
  const [selectedTone, setSelectedTone] = useState(tones[0].name);

  const [selectedShade, setSelectedShade] = useState(null as string | null);

  const { skinType, setSkinColor } = useSkinColor();

  function setSelectedColor(option: string) {
    setSelectedShade(option);
    if (skinType != null) {
      setSkinColor(option, skinType);
    }
  }

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        {tones.map((tone, index) => (
          <div
            key={index}
            className={`inline-flex grow items-center gap-x-2 rounded-full border px-2 py-1 text-white ${
              selectedTone === tone.name ? "border-white" : "border-transparent"
            }`}
            onClick={() => setSelectedTone(tone.name)}
          >
            <div
              className="size-3 rounded-full"
              style={{ background: tone.color }}
            ></div>
            <span className="text-sm">{tone.name}</span>
          </div>
        ))}
      </div>
      <div className="flex w-full gap-4 overflow-x-auto py-2 no-scrollbar">
        <button className="flex size-8 shrink-0 items-center justify-center">
          <Icons.unselect className="size-6 text-white" />
        </button>
        {shadeOptions.map((option, index) => (
          <button
            key={index}
            className={`size-8 shrink-0 rounded-full border border-transparent transition-all data-[selected=true]:scale-[1.15] data-[selected=true]:border-white`}
            data-selected={selectedShade === option}
            style={{
              background: option,
            }}
            onClick={() => {
              setSelectedColor(option);
            }}
          ></button>
        ))}
      </div>
      <div className="w-full text-right">
        <button className="py-4 text-[0.625rem] text-white">View all</button>
      </div>

      <ProductList />
    </div>
  );
}

function ProductList() {
  const { scrollContainerRef, handleMouseDown } = useScrollContainer();
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

  return (
    <div
      className="flex w-full gap-4 overflow-x-auto no-scrollbar active:cursor-grabbing"
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
    >
      {products.map((product, index) => (
        <div key={index} className="w-[110px] rounded shadow">
          <div className="relative h-[80px] w-[110px] overflow-hidden">
            <img
              src={"https://picsum.photos/id/237/200/300"}
              alt="Product"
              className="rounded object-cover"
            />
          </div>

          <h3 className="line-clamp-2 h-10 py-2 text-[0.625rem] font-semibold text-white">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-[0.5rem] text-white/60">{product.brand}</p>
            <div className="flex flex-wrap items-center justify-end gap-x-1">
              <span className="text-[0.625rem] font-bold text-white">
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
  );
}

function BottomContent() {
  const { criterias } = useCamera();
  const { skinType } = useSkinColor();

  if (criterias.isCaptured && skinType != null) {
    return <ShadesSelector />;
  }

  return <div></div>;
}

function RecorderStatus() {
  const { isRecording, formattedTime, handleStartPause, handleStop, isPaused } =
    useRecordingControls();
  const { finish } = useCamera();

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
          <StopCircle className="size-6 text-white" />
        ) : (
          <CirclePlay className="size-6 text-white" />
        )}
      </button>
    </div>
  );
}

export function TopNavigation({
  item = false,
  cart = false,
}: {
  item?: boolean;
  cart?: boolean;
}) {
  const { setPage } = usePage();
  const { flipCamera } = useCamera();
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 [&_button]:pointer-events-auto">
      <div className="flex flex-col gap-4">
        <button className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-black/25 backdrop-blur-3xl">
          <ChevronLeft className="size-6 text-white" />
        </button>

        {item ? (
          <div className="space-y-2 pt-10">
            <div className="flex gap-x-4">
              <button className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/25 backdrop-blur-3xl">
                <Heart className="size-5 text-white" />
              </button>
              <div>
                <p className="font-semibold leading-4 text-white">
                  Pro Filt’r Soft Matte Longwear Liquid Found
                </p>
                <p className="text-white/60">Brand Name</p>
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              <button className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/25 backdrop-blur-3xl">
                <Plus className="size-5 text-white" />
              </button>
              <p className="font-medium text-white">$52.00</p>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-4">
        <button
          type="button"
          className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-black/25 backdrop-blur-3xl"
          onClick={() => {
            setPage(null);
          }}
        >
          <X className="size-6 text-white" />
        </button>
        <div className="relative -m-0.5 p-0.5">
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
          <button
            type="button"
            className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-black/25 backdrop-blur-3xl"
            onClick={flipCamera}
          >
            <Icons.flipCamera className="size-6 text-white" />
          </button>
        </div>
        <button
          type="button"
          className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-black/25 backdrop-blur-3xl"
        >
          <Icons.myCart className="size-6 text-white" />
        </button>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="pointer-events-none absolute bottom-96 right-5 -mr-1 flex flex-col items-center justify-center [&_button]:pointer-events-auto">
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
          <button className="hidden">
            <Icons.upload className="size-6 text-white" />
          </button>
          <button className="hidden">
            <Icons.share className="size-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
