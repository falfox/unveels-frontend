import clsx from "clsx";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CirclePlay,
  Heart,
  PauseCircle,
  Plus,
  StopCircle,
  X,
} from "lucide-react";
import {
  CSSProperties,
  Dispatch,
  Fragment,
  SetStateAction,
  Suspense,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { skin_tones, tone_types } from "../api/attributes/skin_tone";
import { getBrandName, useBrandsQuerySuspense } from "../api/brands";
import { Product } from "../api/shared";
import { useSkinToneProductQuery } from "../api/skin-tone";
import { Footer } from "../components/footer";
import { Icons } from "../components/icons";
import { LoadingProducts } from "../components/loading";
import { VideoScene } from "../components/recorder/recorder";
import {
  CameraProvider,
  useCamera,
} from "../components/recorder/recorder-context";
import { VideoStream } from "../components/recorder/video-stream";
import { ShareModal } from "../components/share-modal";
import {
  SkinColorProvider,
  useSkinColor,
} from "../components/skin-tone-finder-scene/skin-color-context";
import { SkinToneFinderScene } from "../components/skin-tone-finder-scene/skin-tone-finder-scene";
import { usePage } from "../hooks/usePage";
import { useRecordingControls } from "../hooks/useRecorder";
import { useScrollContainer } from "../hooks/useScrollContainer";
import {
  extractUniqueCustomAttributes,
  getProductAttributes,
  mediaUrl,
} from "../utils/apiUtils";
import { MakeupProvider, useMakeup } from "../components/three/makeup-context";
import { bool } from "@techstark/opencv-js";

export function SkinToneFinder() {
  return (
    <CameraProvider>
      <SkinColorProvider>
        <MakeupProvider>
          <div className="h-full min-h-dvh">
            <Main />
          </div>
        </MakeupProvider>
      </SkinColorProvider>
    </CameraProvider>
  );
}

function Main() {
  const { criterias } = useCamera();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative mx-auto h-full min-h-dvh w-full bg-black">
      <div className="absolute inset-0">
        <VideoStream debugMode={false} />
        <SkinToneFinderScene />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
          }}
        ></div>
      </div>
      <RecorderStatus />
      <TopNavigation />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0">
        {criterias.isCaptured ? "" : <VideoScene />}
        <MainContent collapsed={collapsed} setCollapsed={setCollapsed} />
        <Footer />
      </div>
      <Sidebar setCollapsed={setCollapsed} />
    </div>
  );
}

interface MainContentProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

function MainContent({ collapsed, setCollapsed }: MainContentProps) {
  const { criterias, exit } = useCamera();
  const [shareOpen, setShareOpen] = useState(false);

  const onClose = () => {
    setShareOpen(false);
  };

  if (criterias.isFinished) {
    return shareOpen ? (
      <ShareModal onClose={onClose} />
    ) : (
      <div className="flex space-x-5 px-5 pb-10 font-serif">
        <button
          onClick={exit}
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

const isShadeSelected = (product: Product, selectedShade: string) =>
  getProductAttributes(product, "hexacodes")?.value.includes(
    selectedShade ?? "",
  );

function MatchedShades() {
  const [selectedTne, setSelectedTone] = useState(tone_types[0]);
  const { skinType, hexSkin } = useSkinColor();

  const skinToneId = skin_tones.find((tone) => tone.name === skinType)?.id;

  const { data } = useSkinToneProductQuery({
    skintone: skinToneId,
    tonetype: selectedTne.id,
  });

  return (
    <>
      <div className="flex flex-col items-start">
        <div className="inline-flex items-center gap-x-2 rounded-full border border-white/80 px-2 py-1 text-white/80">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: hexSkin }}
          ></div>
          <span className="text-sm">{skinType}</span>
        </div>
        <div className="flex w-full min-w-0 pt-2">
          {tone_types.map((option, index) => (
            <button
              key={index}
              className={`w-full border border-transparent py-2 text-xs text-white transition-all data-[selected=true]:scale-[1.15] data-[selected=true]:border-white`}
              data-selected={selectedTne.name === option.name}
              style={{
                background: option.color,
              }}
              onClick={() => setSelectedTone(option)}
            >
              {option.name}
            </button>
          ))}
        </div>
        <div className="w-full text-right">
          <button className="py-2 text-[0.625rem] text-white">View all</button>
        </div>

        {data ? (
          <Suspense fallback={<LoadingProducts />}>
            <ProductList products={data.items} />
          </Suspense>
        ) : (
          <LoadingProducts />
        )}
      </div>
    </>
  );
}

function OtherShades() {
  const [selectedTone, setSelectedTone] = useState(skin_tones[0]);

  const [selectedShade, setSelectedShade] = useState(null as string | null);

  const { setHexColor } = useSkinColor();

  const { setFoundationColor } = useMakeup();

  const { data } = useSkinToneProductQuery({
    skintone: selectedTone.id,
  });

  const hexCodes = data
    ? extractUniqueCustomAttributes(data.items, "hexacode")
    : [];

  const shadesOptions = hexCodes
    .filter(Boolean)
    .map((hexes: string) => hexes.split(","))
    .flat();

  const filteredProducts = selectedShade
    ? (data?.items.filter((i: Product) => isShadeSelected(i, selectedShade)) ??
      [])
    : (data?.items ?? []);

  function setSelectedColor(option: string) {
    setSelectedShade(option);
    setHexColor(option);
    setFoundationColor(option);
  }

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex w-full items-center gap-3 overflow-x-auto no-scrollbar">
        {skin_tones.map((tone, index) => (
          <div
            key={index}
            className={clsx(
              "inline-flex shrink-0 grow items-center gap-x-2 rounded-full border px-2 py-1 text-white",
              selectedTone.name === tone.name
                ? "border-white"
                : "border-transparent",
            )}
            onClick={() => setSelectedTone(tone)}
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
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center transition-all data-[selected=true]:scale-[1.15] data-[selected=true]:border-white"
          data-selected={selectedShade === null}
          onClick={() => setSelectedShade(null)}
        >
          <Icons.unselect className="size-7 text-white" />
        </button>
        {shadesOptions.map((option, index) => (
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
        <button className="py-2 text-[0.625rem] text-white">View all</button>
      </div>

      {data ? (
        <Suspense fallback={<LoadingProducts />}>
          <ProductList products={filteredProducts} />
        </Suspense>
      ) : (
        <LoadingProducts />
      )}
    </div>
  );
}

function ProductList({ products }: { products: Array<Product> }) {
  const { scrollContainerRef, handleMouseDown } = useScrollContainer();
  const { data } = useBrandsQuerySuspense();

  return (
    <div
      className="flex w-full gap-4 overflow-x-auto no-scrollbar active:cursor-grabbing"
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
    >
      {products.map((product, index) => {
        const imageUrl =
          mediaUrl(product.media_gallery_entries[0].file) ??
          "https://picsum.photos/id/237/200/300";

        const brand = getBrandName(
          data.options,
          product.custom_attributes.find(
            (attr) => attr.attribute_code === "brand",
          )?.value as string,
        );

        return (
          <a
            key={index}
            className="block w-[110px] rounded shadow"
            target="_blank"
            href={product.sku}
          >
            <div className="relative h-[80px] w-[110px] overflow-hidden">
              <img
                src={imageUrl}
                alt="Product"
                className="rounded object-cover"
              />
            </div>

            <h3 className="line-clamp-2 h-10 py-2 text-[0.625rem] font-semibold text-white">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-[0.5rem] text-white/60">{brand}</p>
              <div className="flex flex-wrap items-center justify-end gap-x-1">
                <span className="text-[0.625rem] font-bold text-white">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
          </a>
        );
      })}
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
  const { startRecording, stopRecording } = useCamera();
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
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
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
        <Link
          type="button"
          className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-black/25 backdrop-blur-3xl"
          to="/"
        >
          <X className="size-6 text-white" />
        </Link>
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

interface SidebarProps {
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}
function Sidebar({ setCollapsed }: SidebarProps) {
  const { flipCamera, compareCapture, resetCapture, screenShoot } = useCamera();
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
          <button className="" onClick={screenShoot}>
            <Icons.camera className="size-6 text-white" />
          </button>
          <button className="" onClick={flipCamera}>
            <Icons.flipCamera className="size-6 text-white" />
          </button>
          <button
            className=""
            onClick={() => setCollapsed((prevState) => !prevState)}
          >
            <Icons.expand className="size-6 text-white" />
          </button>
          <button className="" onClick={compareCapture}>
            <Icons.compare className="size-6 text-white" />
          </button>
          <button className="">
            <Icons.reset onClick={resetCapture} className="size-6 text-white" />
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
