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
import { sleep } from "../utils";

export function SkinToneFinder() {
  return (
    <CameraProvider>
      <div className="h-full min-h-dvh">
        <div className="relative w-full h-full mx-auto bg-black min-h-dvh">
          <div className="absolute inset-0">
            <VideoStream />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
              }}
            ></div>
          </div>
          <RecorderStatus />
          <TopNavigation item />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0">
            <MainContent />
            <Footer />
          </div>
          <Sidebar />
        </div>
      </div>
    </CameraProvider>
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
      <div className="flex px-5 pb-10 space-x-5 font-serif">
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
          Share <Icons.share className="inline-block ml-4 size-6" />
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
            <ChevronUp className="text-white size-6" />
          ) : (
            <ChevronDown className="text-white size-6" />
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
    <div className="px-4 space-y-2">
      <div className="flex items-center justify-between w-full h-10 text-center border-b border-gray-600">
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
                      <span className="text-lg text-center">
                        {shadeTab.charAt(0).toUpperCase() + shadeTab.slice(1)}{" "}
                        Shades
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg text-center text-white/70">
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

  return (
    <>
      <div className="flex flex-col items-start">
        <div className="inline-flex items-center px-2 py-1 border rounded-full gap-x-2 border-white/80 text-white/80">
          <div className="size-3 rounded-full bg-[#D18B59]"></div>
          <span className="text-sm">Medium skin</span>
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

  return (
    <div className="flex flex-col items-start w-full gap-2">
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
              className="rounded-full size-3"
              style={{ background: tone.color }}
            ></div>
            <span className="text-sm">{tone.name}</span>
          </div>
        ))}
      </div>
      <div className="flex w-full gap-4 py-2 overflow-x-auto no-scrollbar">
        <button className="flex items-center justify-center size-8 shrink-0">
          <Icons.unselect className="text-white size-6" />
        </button>
        {shadeOptions.map((option, index) => (
          <button
            key={index}
            className={`size-8 shrink-0 rounded-full border border-transparent transition-all data-[selected=true]:scale-[1.15] data-[selected=true]:border-white`}
            data-selected={selectedShade === option}
            style={{
              background: option,
            }}
            onClick={() => setSelectedShade(option)}
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
              className="object-cover rounded"
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
  const { criterias, setCriterias } = useCamera();

  useEffect(() => {
    (async () => {
      await sleep(2000);
      setCriterias({ lighting: true });
      await sleep(2000);
      setCriterias({ facePosition: true });
      await sleep(2000);
      setCriterias({ orientation: true });
    })();
  }, []);

  if (criterias.facePosition && criterias.lighting && criterias.orientation) {
    return <ShadesSelector />;
  }

  return <VideoScene />;
}

function RecorderStatus() {
  const { isRecording, formattedTime, handleStartPause, handleStop, isPaused } =
    useRecordingControls();
  const { finish } = useCamera();

  return (
    <div className="absolute inset-x-0 flex items-center justify-center gap-4 top-14">
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
        <button className="flex items-center justify-center overflow-hidden rounded-full size-8 bg-black/25 backdrop-blur-3xl">
          <ChevronLeft className="text-white size-6" />
        </button>

        {item ? (
          <div className="pt-10 space-y-2">
            <div className="flex gap-x-4">
              <button className="flex items-center justify-center rounded-full size-8 shrink-0 bg-black/25 backdrop-blur-3xl">
                <Heart className="text-white size-5" />
              </button>
              <div>
                <p className="font-semibold leading-4 text-white">
                  Pro Filt’r Soft Matte Longwear Liquid Found
                </p>
                <p className="text-white/60">Brand Name</p>
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              <button className="flex items-center justify-center rounded-full size-8 shrink-0 bg-black/25 backdrop-blur-3xl">
                <Plus className="text-white size-5" />
              </button>
              <p className="font-medium text-white">$52.00</p>
            </div>
          </div>
        ) : null}
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
        <div className="relative -m-0.5 p-0.5">
          <div
            className="absolute inset-0 border-2 border-transparent rounded-full"
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
            className="flex items-center justify-center overflow-hidden rounded-full size-8 bg-black/25 backdrop-blur-3xl"
            onClick={flipCamera}
          >
            <Icons.flipCamera className="text-white size-6" />
          </button>
        </div>
        <button
          type="button"
          className="flex items-center justify-center overflow-hidden rounded-full size-8 bg-black/25 backdrop-blur-3xl"
        >
          <Icons.myCart className="text-white size-6" />
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
          className="absolute inset-0 border-2 border-transparent rounded-full"
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
            <Icons.camera className="text-white size-6" />
          </button>
          <button className="">
            <Icons.flipCamera className="text-white size-6" />
          </button>
          <button className="">
            <Icons.expand className="text-white size-6" />
          </button>
          <button className="">
            <Icons.compare className="text-white size-6" />
          </button>
          <button className="">
            <Icons.reset className="text-white size-6" />
          </button>
          <button className="hidden">
            <Icons.upload className="text-white size-6" />
          </button>
          <button className="hidden">
            <Icons.share className="text-white size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
