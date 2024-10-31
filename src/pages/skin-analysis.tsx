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
import { TopNavigation } from "./skin-tone-finder";
import { CircularProgressRings } from "../components/circle-progress-rings";
import { Rating } from "../components/rating";
import { skinAnalysisInference } from "../inference/skinAnalysisInference";
import { FaceResults } from "../types/faceResults";
import { SkinAnalysisScene } from "../components/skin-analysis/skin-analysis-scene";

export function SkinAnalysis() {
  return (
    <CameraProvider>
      <div className="h-full min-h-dvh">
        <Main />
      </div>
    </CameraProvider>
  );
}

function Main() {
  const { criterias } = useCamera();
  const [inferenceResult, setInferenceResult] = useState<FaceResults[] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inferenceError, setInferenceError] = useState<string | null>(null);
  const [isInferenceRunning, setIsInferenceRunning] = useState<boolean>(false);

  useEffect(() => {
    const faceAnalyzerInference = async () => {
      if (criterias.isCaptured && criterias.capturedImage && !isLoading) {
        setIsInferenceRunning(true);
        setIsLoading(true);
        setInferenceError(null);
        try {
          const skinAnalysisResult: FaceResults[] = await skinAnalysisInference(
            criterias.capturedImage,
          );

          setInferenceResult(skinAnalysisResult);
        } catch (error: any) {
          console.error("Inference error:", error);
          setInferenceError(
            error.message || "An error occurred during inference.",
          );
        } finally {
          setIsLoading(false); // Pastikan isLoading diubah kembali
          setIsInferenceRunning(false); // Tambahkan ini jika perlu
        }
      }
    };

    faceAnalyzerInference();
  }, [criterias.isCaptured, criterias.capturedImage]);

  return (
    <div className="relative w-full h-full mx-auto bg-black min-h-dvh">
      <div className="absolute inset-0">
        {!isLoading && inferenceResult != null ? (
          <SkinAnalysisScene data={inferenceResult} />
        ) : (
          <VideoStream />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
          }}
        ></div>
      </div>
      <RecorderStatus />
      <TopNavigation item={false} />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0">
        <MainContent />
        <Footer />
      </div>
    </div>
  );
}

function MainContent() {
  const { criterias } = useCamera();
  const [shareOpen, setShareOpen] = useState(false);

  if (criterias.isFinished) {
    return shareOpen ? (
      <ShareModal
        onClose={() => {
          setShareOpen(false);
        }}
      />
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

  return <BottomContent />;
}

const tabs = [
  "Wrinkles",
  "Spots",
  "Texture",
  "Dark circles",
  "Redness",
  "Oiliness",
  "Moisture",
  "Pores",
  "Eye Bags",
  "Radiance",
  "Firminess",
  "Droopy Upper Eyelid",
  "Droopy Lower Eyelid",
  "Acne",
] as const;

function SkinProblems({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Wrinkles");

  return (
    <>
      <div
        className="fixed inset-0 w-full h-full"
        onClick={() => {
          onClose();
        }}
      ></div>
      <div className="relative px-4 pb-4 space-y-2">
        <div className="flex w-full items-center space-x-3.5 overflow-x-auto overflow-y-visible pt-7 no-scrollbar">
          {tabs.map((problemTab) => {
            const isActive = tab === problemTab;
            return (
              <Fragment key={problemTab}>
                <button
                  key={problemTab}
                  className={clsx(
                    "overflow relative shrink-0 rounded-full border border-white px-3 py-1 text-sm text-white",
                    {
                      "bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)]":
                        isActive,
                    },
                  )}
                  onClick={() => setTab(problemTab)}
                >
                  {problemTab}

                  <div
                    className={clsx(
                      "absolute inset-x-0 -top-6 text-center text-white",
                      {
                        hidden: !isActive,
                      },
                    )}
                  >
                    60%
                  </div>
                </button>
              </Fragment>
            );
          })}
        </div>

        <div className="px-8">
          <DescriptionText text="Hey there! As much as we embrace aging gracefully, those detected creases and lines can sneak up on us sooner than we'd like. To fend off those pesky wrinkles, remember to stay hydrated and wear sunscreen daily. Adding a skin-nourishing routine can work wonders. Embrace your lines, but there's no harm in giving them a little extra tender loving care by checking our recommendations to keep them at bay for as long as possible. Your future self will thank you and us for the care!  Less" />
        </div>

        <ProductList />
      </div>
    </>
  );
}

function DescriptionText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="py-5">
      <h4 className="pb-1 text-xl font-bold text-white">Description</h4>
      <p
        className={clsx("text-sm text-white", {
          "line-clamp-3": !expanded,
        })}
      >
        {text}
      </p>
      <button
        type="button"
        className="inline-block text-sm text-[#CA9C43]"
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {expanded ? "Less" : "Read more"}
      </button>
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
        <div key={index} className="w-[115px] rounded shadow">
          <div className="relative h-[80px] w-[115px] overflow-hidden">
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
          <div className="flex pt-1 space-x-1">
            <button
              type="button"
              className="flex h-7 w-full items-center justify-center border border-white text-[0.375rem] font-semibold text-white"
            >
              ADD TO CART
            </button>
            <button
              type="button"
              className="flex h-7 w-full items-center justify-center border border-white bg-white text-[0.45rem] font-semibold text-black"
            >
              SEE IMPROVEMENT
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BottomContent() {
  const { criterias, setCriterias } = useCamera();
  const [view, setView] = useState<"face" | "problems" | "results">("face");

  if (criterias.isCaptured) {
    if (view === "face") {
      return (
        <ProblemResults
          onFaceClick={() => {
            setView("problems");
          }}
          onResultClick={() => {
            setView("results");
          }}
        />
      );
    }

    if (view === "problems") {
      return (
        <SkinProblems
          onClose={() => {
            setView("face");
          }}
        />
      );
    }

    return (
      <AnalysisResults
        onClose={() => {
          setView("face");
        }}
      />
    );
  }

  return <VideoScene />;
}

function ProblemResults({
  onFaceClick,
  onResultClick,
}: {
  onFaceClick?: () => void;
  onResultClick?: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 w-full h-full"
        onClick={() => {
          onFaceClick?.();
        }}
      ></div>
      <div className="absolute inset-x-0 flex items-center justify-center bottom-32">
        <button
          type="button"
          className="px-10 py-3 text-sm text-white bg-black"
          onClick={() => {
            onResultClick?.();
          }}
        >
          ANALYSIS RESULT
        </button>
      </div>
    </>
  );
}

function AnalysisResults({ onClose }: { onClose: () => void }) {
  return (
    <div
      className={clsx(
        "fixed inset-0 flex h-dvh flex-col bg-black font-sans text-white",
      )}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-2">
        <button className="size-6">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button type="button" className="size-6" onClick={() => onClose()}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-end space-x-2.5 px-5">
          <Heart className="size-6" />
          <Icons.bag className="size-6" />
        </div>

        <h1 className="bg-[linear-gradient(89.39deg,#92702D_0.52%,#CA9C43_99.44%)] bg-clip-text text-3xl font-medium text-transparent">
          Analysis Results
        </h1>
      </div>

      {/* Profile Section */}
      <div className="flex items-center px-5 py-2 space-x-1">
        <div className="px-5 shrink-0">
          <div className="flex items-center justify-center rounded-full bg-gradient-to-b from-[#CA9C43] to-[#644D21] p-1">
            <img
              className="rounded-full size-24"
              src="https://avatar.iran.liara.run/public/30"
              alt="Profile"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <Icons.chart className="size-5" />
            <div className="text-lg">Skin Health Score : 72%</div>
          </div>
          <div className="flex items-center gap-x-2">
            <Icons.hashtagCircle className="size-5" />
            <div className="text-lg">Skin Age: 27</div>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <h2 className="text-xl font-medium text-center">
          Detected Skin Problems
        </h2>

        <div className="relative pt-8">
          <CircularProgressRings
            className="mx-auto size-96"
            data={[
              { percentage: 90, color: "#F72585" },
              { percentage: 80, color: "#E9A0DD" },
              { percentage: 60, color: "#F4EB24" },
              { percentage: 40, color: "#0F38CC" },
              { percentage: 20, color: "#00E0FF" },
              { percentage: 10, color: "#6B13B1" },
              { percentage: 5, color: "#00FF38" },
            ]}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
            <div className="text-xl font-bold">80%</div>
            <div className="">Skin Problems</div>
          </div>
        </div>

        <div className="flex items-start justify-between px-10 space-x-4 text-white bg-black">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#00FF38] text-sm font-bold text-white">
                30%
              </div>
              <span>Texture</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#6B13B1] text-sm font-bold text-white">
                45%
              </div>
              <span>Dark Circles</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#00E0FF] text-sm font-bold text-white">
                60%
              </div>
              <span>Eyebags</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0F38CC] text-sm font-bold text-white">
                75%
              </div>
              <span>Wrinkles</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F4EB24] text-sm font-bold text-white">
                90%
              </div>
              <span>Pores</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E9A0DD] text-sm font-bold text-white">
                90%
              </div>
              <span>Spots</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F72585] text-sm font-bold text-white">
                90%
              </div>
              <span>Acne</span>
            </div>
          </div>
        </div>

        <h2 className="pt-12 text-xl font-medium text-center">
          Detected Skin Condition
        </h2>

        <div className="relative pt-8">
          <CircularProgressRings
            className="mx-auto size-96"
            data={[
              // background: #4CC9F0;
              // background: #BD8EFF;
              // background: #B5179E;
              // background: #5DD400;
              // background: #14A086;
              // background: #F72585;
              // background: #F1B902;

              { percentage: 90, color: "#4CC9F0" },
              { percentage: 80, color: "#BD8EFF" },
              { percentage: 60, color: "#B5179E" },
              { percentage: 40, color: "#5DD400" },
              { percentage: 20, color: "#14A086" },
              { percentage: 10, color: "#F72585" },
              { percentage: 5, color: "#F1B902" },
            ]}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
            <div className="text-xl font-bold">80%</div>
            <div className="">Skin Problems</div>
          </div>
        </div>

        <div className="flex items-start justify-between px-10 space-x-4 text-white bg-black">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F1B902] text-sm font-bold text-white">
                30%
              </div>
              <span>Firmness</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F72585] text-sm font-bold text-white">
                45%
              </div>
              <span>Droopy Upper Eyelid</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#14A086] text-sm font-bold text-white">
                60%
              </div>
              <span>Droopy Lower Eyelid</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#5DD400] text-sm font-bold text-white">
                75%
              </div>
              <span>Moisture Level</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#B5179E] text-sm font-bold text-white">
                90%
              </div>
              <span>Oiliness</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#BD8EFF] text-sm font-bold text-white">
                90%
              </div>
              <span>Redness</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#4CC9F0] text-sm font-bold text-white">
                90%
              </div>
              <span>Radiance</span>
            </div>
          </div>
        </div>

        <div className="px-2 py-10 text-white divide-y divide-white/50">
          <ProblemSection
            title="Wrinkles"
            detected="Forehead: Mild spots observed, likely due to sun exposure.Cheeks: A few dark spots noted on both cheeks, possibly post-inflammatory hyperpigmentation"
            description="Wrinkles are a natural part of aging, but they can also develop as a result of sun exposure, dehydration, and smoking. They can be treated with topical creams, botox, and fillers."
            score={75}
          />
          <ProblemSection
            title="Spots"
            detected="Forehead: Mild spots observed, likely due to sun exposure.Cheeks: A few dark spots noted on both cheeks, possibly post-inflammatory hyperpigmentation"
            description="Spots can be caused by sun exposure, hormonal changes, and skin inflammation. They can be treated with topical creams, laser therapy, and chemical peels."
            score={90}
          />
          <ProblemSection
            title="Texture"
            detected="Detected"
            description="Uneven skin texture can be caused by acne, sun damage, and aging. It can be treated with exfoliation, laser therapy, and microneedling."
            score={30}
          />
          <ProblemSection
            title="Dark circles"
            detected="Detected"
            description="Dark circles can be caused by lack of sleep, dehydration, and genetics. They can be treated with eye creams, fillers, and laser therapy."
            score={45}
          />
          <ProblemSection
            title="Redness"
            detected="Detected"
            description="Redness can be caused by rosacea, sunburn, and skin sensitivity. It can be treated with topical creams, laser therapy, and lifestyle changes."
            score={90}
          />
          <ProblemSection
            title="Oiliness"
            detected="Detected"
            description="Oiliness can be caused by hormonal changes, stress, and genetics. It can be treated with oil-free skincare products, medication, and lifestyle changes."
            score={90}
          />
          <ProblemSection
            title="Moisture"
            detected="Detected"
            description="Dry skin can be caused by cold weather, harsh soaps, and aging. It can be treated with moisturizers, humidifiers, and lifestyle changes."
            score={75}
          />
          <ProblemSection
            title="Pores"
            detected="Detected"
            description="Large pores can be caused by genetics, oily skin, and aging. They can be treated with topical creams, laser therapy, and microneedling."
            score={90}
          />
          <ProblemSection
            title="Eye Bags"
            detected="Detected"
            description="Eye bags can be caused by lack of sleep, allergies, and aging. They can be treated with eye creams, fillers, and surgery."
            score={60}
          />
          <ProblemSection
            title="Radiance"
            detected="Detected"
            description="Dull skin can be caused by dehydration, poor diet, and lack of sleep. It can be treated with exfoliation, hydration, and lifestyle changes."
            score={90}
          />
          <ProblemSection
            title="Firminess"
            detected="Detected"
            description="Loss of firmness can be caused by aging, sun exposure, and smoking. It can be treated with topical creams, botox, and fillers."
            score={30}
          />
          <ProblemSection
            title="Droopy Upper Eyelid"
            detected="Detected"
            description="Droopy eyelids can be caused by aging, genetics, and sun exposure. They can be treated with eyelid surgery, botox, and fillers."
            score={45}
          />
          <ProblemSection
            title="Droopy Lower Eyelid"
            detected="Detected"
            description="Droopy eyelids can be caused by aging, genetics, and sun exposure. They can be treated with eyelid surgery, botox, and fillers."
            score={60}
          />
          <ProblemSection
            title="Acne"
            detected="Detected"
            description="Acne can be caused by hormonal changes, stress, and genetics. It can be treated with topical creams, medication, and lifestyle changes."
            score={90}
          />
        </div>
      </div>
    </div>
  );
}

function ProblemSection({
  title,
  detected,
  description,
  score,
}: {
  title: string;
  detected: string;
  description: string;
  score: number;
}) {
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

  // High -> 70% - 100%
  // Moderate -> above 40% - 69%
  // low -> 0% - 39%
  const scoreType = score < 40 ? "Low" : score < 70 ? "Moderate" : "High";
  return (
    <div className="py-5">
      <div className="flex items-center pb-6 space-x-2">
        <Icons.personalityTriangle className="size-8 shrink-0" />

        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>
      <span className="text-xl font-bold">Detected</span>
      <p className="pt-1 pb-6 text-sm">{detected}</p>
      <div className="pt-6"></div>
      <span className="text-xl font-bold">Description</span>
      <p className="pt-1 pb-6 text-sm">{description}</p>
      <span className="text-xl font-bold">Score</span>
      <div
        className={clsx(
          "text-sm",
          score < 40
            ? "text-[#FF0000]"
            : score < 70
              ? "text-[#FAFF00]"
              : "text-[#5ED400]",
        )}
      >
        {scoreType} {score}%
      </div>

      <div className="py-8">
        <h2 className="pb-4 text-xl font-bold">Recommended products</h2>
        <div className="flex w-full gap-4 overflow-x-auto no-scrollbar">
          {products.map((product, index) => (
            <div key={index} className="w-[150px] rounded">
              <div className="relative h-[150px] w-[150px] overflow-hidden">
                <img
                  src={"https://picsum.photos/id/237/200/300"}
                  alt="Product"
                  className="object-cover rounded"
                />
              </div>

              <div className="flex items-start justify-between py-2">
                <div className="w-full">
                  <h3 className="h-10 text-sm font-semibold text-white line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[0.625rem] text-white/60">
                    {product.brand}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-x-1">
                  <span className="text-sm font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <Rating rating={4} />

              <div className="flex space-x-1">
                <button
                  type="button"
                  className="flex h-7 w-full items-center justify-center border border-white text-[0.5rem] font-semibold"
                >
                  ADD TO CART
                </button>
                <button
                  type="button"
                  className="flex h-7 w-full items-center justify-center border border-white bg-white text-[0.5rem] font-semibold text-black"
                >
                  SEE IMPROVEMENT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
