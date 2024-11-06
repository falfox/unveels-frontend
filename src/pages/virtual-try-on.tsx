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
import { cloneElement, CSSProperties, Fragment, useState } from "react";
import { Icons } from "../components/icons";

import { Link, Outlet, useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";

import { Footer } from "../components/footer";
import { VideoScene } from "../components/recorder/recorder";
import {
  CameraProvider,
  useCamera,
} from "../components/recorder/recorder-context";
import { ShareModal } from "../components/share-modal";
import { SkinColorProvider } from "../components/skin-tone-finder-scene/skin-color-context";
import { usePage } from "../hooks/usePage";
import { useRecordingControls } from "../hooks/useRecorder";
import { EyesMode } from "./vto/eyes/eyes-makeup";
import { FaceMode } from "./vto/face/face-makeup";
import { HairMode } from "./vto/hair/hair-makeup";
import { HandAccessoriesMode } from "./vto/hand-accessories/hand-accessories";
import { HeadAccessoriesMode } from "./vto/head-accesories/head-accessories";
import { LipsMode } from "./vto/lips/lips-makeup";
import { NailsMode } from "./vto/nails/nails-makeup";
import { NeckAccessoriesMode } from "./vto/neck-accessories/neck-accessories";
import { VirtualTryOnScene } from "../components/vto/virtual-try-on-scene";
import { MakeupProvider } from "../components/three/makeup-context";
import { AccesoriesProvider } from "../components/three/accesories-context";
import { LipColorProvider } from "./vto/lips/lip-color/lip-color-context";
import { LipLinerProvider } from "./vto/lips/lip-liner/lip-liner-context";
import { LipPlumperProvider } from "./vto/lips/lip-plumper/lip-plumper-context";

interface VirtualTryOnProvider {
  children: React.ReactNode;
}

export function VirtualTryOnProvider({ children }: VirtualTryOnProvider) {
  return (
    <LipColorProvider>
      <LipLinerProvider>
        <LipPlumperProvider>{children}</LipPlumperProvider>
      </LipLinerProvider>
    </LipColorProvider>
  );
}

export function VirtualTryOn() {
  return (
    <CameraProvider>
      <SkinColorProvider>
        <MakeupProvider>
          <AccesoriesProvider>
            <VirtualTryOnProvider>
              <div className="h-full min-h-dvh">
                <Main />
              </div>
            </VirtualTryOnProvider>
          </AccesoriesProvider>
        </MakeupProvider>
      </SkinColorProvider>
    </CameraProvider>
  );
}

function Main() {
  return (
    <div className="relative mx-auto h-full min-h-dvh w-full bg-black">
      <div className="absolute inset-0">
        <VirtualTryOnScene />
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
        <Sidebar />
        <MainContent />
        <Footer />
      </div>
    </div>
  );
}

function MainContent() {
  const [collapsed, setCollapsed] = useState(false);
  const { criterias } = useCamera();
  const [shareOpen, setShareOpen] = useState(false);
  const navigate = useNavigate();

  if (criterias.isFinished) {
    return shareOpen ? (
      <ShareModal
        onClose={() => {
          setShareOpen(false);
        }}
      />
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
            navigate("/virtual-try-on/makeups");
          }}
        >
          <ChevronDown className="size-6 text-white" />
        </button>
      </div>
    </>
  );
}

export function TryOnSelector() {
  const [tab, setTab] = useState(null as "makeup" | "accessories" | null);

  const activeClassNames =
    "border-white inline-block text-transparent bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)] bg-clip-text text-transparent";

  return (
    <div className="w-full px-4 mx-auto space-y-2 lg:max-w-xl">
      <div className="flex items-center justify-between w-full h-10 text-center border-b border-gray-600">
        {["makeup", "accessories"].map((shadeTab) => {
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
                onClick={() => setTab(shadeTab as "makeup" | "accessories")}
              >
                <span className={isActive ? "text-white/70 blur-sm" : ""}>
                  {shadeTab.charAt(0).toUpperCase() + shadeTab.slice(1)}
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
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg text-center text-white/70">
                        {shadeTab.charAt(0).toUpperCase() + shadeTab.slice(1)}{" "}
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

      {tab === "makeup" ? (
        <Makeups />
      ) : tab === "accessories" ? (
        <Accessories />
      ) : null}
      <Outlet />
    </div>
  );
}

export function Makeups() {
  const shadeOptions = [
    {
      name: "Lips",
      icon: <Icons.makeupLips />,
      items: ["Lip Color", "Lip Liner", "Lip Plumper"],
    },
    {
      name: "Eyes",
      icon: <Icons.makeupEyes />,
    },
    {
      name: "Face",
      icon: <Icons.makeupFace />,
    },
    {
      name: "Nails",
      icon: <Icons.makeupNails />,
    },
    {
      name: "Hair",
      icon: <Icons.makeupHair />,
    },
  ];

  const [selectedMakeup, setSelectedMakeup] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-col items-start">
        <div className="flex w-full min-w-0 justify-between py-4 peer-has-[data-mode]:hidden">
          {shadeOptions.map((option, index) => (
            <button
              key={index}
              className="flex flex-col items-center space-y-2"
              data-selected={selectedMakeup === option.name}
              onClick={() => setSelectedMakeup(option.name)}
            >
              <div
                className={clsx(
                  "relative flex w-12 shrink-0 items-center justify-center rounded-3xl border border-transparent py-2 text-center text-xs text-white transition-all",
                  {
                    "bg-gradient-to-r from-[#CA9C43] via-[#916E2B] to-[#473209]":
                      selectedMakeup === option.name,
                  },
                )}
              >
                {cloneElement(option.icon, {
                  className: "text-white size-6",
                })}

                <div
                  className="absolute inset-0 p-1 border-2 border-transparent rounded-3xl"
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
              </div>
              <div className="text-white">{option.name}</div>
            </button>
          ))}
        </div>

        {selectedMakeup === "Lips" ? (
          <LipsMode />
        ) : selectedMakeup === "Eyes" ? (
          <EyesMode />
        ) : selectedMakeup === "Face" ? (
          <FaceMode />
        ) : selectedMakeup === "Nails" ? (
          <NailsMode />
        ) : selectedMakeup === "Hair" ? (
          <HairMode />
        ) : null}
      </div>
    </>
  );
}

export function Accessories() {
  const shadeOptions = [
    {
      name: "Head Accessories",
      icon: <Icons.accessoryHead />,
    },
    {
      name: "Neck Accessories",
      icon: <Icons.accessoryNeck />,
    },
    {
      name: "Hand Accessories",
      icon: <Icons.accessoryHand />,
    },
    {
      name: "Nails",
      icon: <Icons.makeupNails />,
    },
  ];

  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(
    null,
  );

  return (
    <>
      <div className="flex flex-col items-start">
        <div className="flex w-full min-w-0 justify-between py-4 peer-has-[data-mode]:hidden">
          {shadeOptions.map((option, index) => (
            <button
              key={index}
              className="flex flex-col items-center space-y-2"
              data-selected={selectedAccessory === option.name}
              onClick={() => setSelectedAccessory(option.name)}
            >
              <div
                className={clsx(
                  "relative flex w-12 shrink-0 items-center justify-center rounded-3xl border border-transparent py-2 text-center text-xs text-white transition-all",
                  {
                    "bg-gradient-to-r from-[#CA9C43] via-[#916E2B] to-[#473209]":
                      selectedAccessory === option.name,
                  },
                )}
              >
                {cloneElement(option.icon, {
                  className: "text-white size-6",
                })}

                <div
                  className="absolute inset-0 p-1 border-2 border-transparent rounded-3xl"
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
              </div>
              <div className="text-white">{option.name}</div>
            </button>
          ))}
        </div>

        {selectedAccessory === "Head Accessories" ? (
          <HeadAccessoriesMode />
        ) : selectedAccessory === "Neck Accessories" ? (
          <NeckAccessoriesMode />
        ) : selectedAccessory === "Hand Accessories" ? (
          <HandAccessoriesMode />
        ) : selectedAccessory === "Nails" ? (
          <NailsMode />
        ) : null}
      </div>
    </>
  );
}

function BottomContent() {
  return <Outlet />;
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
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
      <div className="flex flex-col gap-4">
        <Link
          className="flex items-center justify-center overflow-hidden rounded-full size-8 bg-black/25 backdrop-blur-3xl"
          to="/virtual-try-on/makeups"
        >
          <ChevronLeft className="text-white size-6" />
        </Link>

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
        <Link
          type="button"
          className="flex items-center justify-center overflow-hidden rounded-full size-8 bg-black/25 backdrop-blur-3xl"
          to="/"
        >
          <X className="text-white size-6" />
        </Link>
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
    <div className="pointer-events-none flex flex-col items-center justify-center place-self-end pb-4 pr-5 [&_button]:pointer-events-auto">
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
          <UploadMediaDialog />
          <button>
            <Icons.share className="text-white size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadMediaDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="flex items-center justify-center">
          <Icons.upload className="text-white size-6" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 flex max-h-[85vh] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col justify-center rounded-lg bg-[#0000002E] px-2 py-4 text-white backdrop-blur">
          <div className="flex flex-col justify-center w-full">
            <Dialog.Title className="mb-2 text-center text-[14px] text-white">
              How would you like to try on the makeup ?
            </Dialog.Title>
            <div className="grid grid-cols-3 gap-2">
              <button className="upload-photo flex w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-[#00000042] p-2 backdrop-blur">
                <Icons.uploadPhoto className="text-white size-5" />

                <p className="mt-2 text-center text-[12px] text-white">
                  Upload Photo
                </p>
                <p className="mt-1 text-left text-[8px] text-white">
                  Upload a photo of yourself to see how different makeup shades
                  look on you.
                </p>
              </button>

              <button className="upload-video flex w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-[#00000042] p-2 backdrop-blur">
                <Icons.uploadVideo className="text-white size-5" />
                <p className="mt-2 text-center text-[12px] text-white">
                  Upload Video
                </p>
                <p className="mt-1 text-left text-[8px] text-white">
                  Upload a video to apply makeup dynamically and see how they
                  look in motion.
                </p>
              </button>

              <button className="choose-model flex w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-[#00000042] p-2 backdrop-blur">
                <Icons.chooseModel className="text-white size-5" />
                <p className="mt-2 text-center text-[12px] text-white">
                  Choose model
                </p>
                <p className="mt-1 text-left text-[8px] text-white">
                  Choose a model to see how different makeup appear on a
                  pre-selected image.
                </p>
              </button>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
