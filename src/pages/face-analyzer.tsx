import { ReactNode, useState, useEffect } from "react";
import { Icons } from "../components/icons";
import clsx from "clsx";
import {
  ChevronLeft,
  CirclePlay,
  PauseCircle,
  StopCircle,
  X,
} from "lucide-react";
import { Footer } from "../components/footer";
import { Rating } from "../components/rating";
import { VideoScene } from "../components/recorder/recorder";
import {
  CameraProvider,
  useCamera,
} from "../components/recorder/recorder-context";
import { VideoStream } from "../components/recorder/video-stream";
import { useRecordingControls } from "../hooks/useRecorder";
import { TopNavigation } from "./skin-tone-finder";
import { personalityInference } from "../inference/personalityInference";
import { Classifier } from "../types/classifier";
import { usePage } from "../hooks/usePage";
import { LoadingProducts } from "../components/loading";
import { useFragrancesProductQuery } from "../api/fragrances";
import { useLipsProductQuery } from "../api/lips";
import { useLookbookProductQuery } from "../api/lookbook";
import { getProductAttributes, mediaUrl } from "../utils/apiUtils";
import { BrandName } from "../components/product/brand";

export function FaceAnalyzer() {
  return (
    <CameraProvider>
      <div className="h-full min-h-dvh">
        <MainContent />
      </div>
    </CameraProvider>
  );
}

function MainContent() {
  const { criterias } = useCamera();

  if (criterias.isCaptured) {
    return <Result />;
  }

  return (
    <div className="relative w-full h-full mx-auto min-h-dvh bg-pink-950">
      <div className="absolute inset-0">
        <VideoStream debugMode={false} />
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
        <VideoScene />
        <Footer />
      </div>
    </div>
  );
}

function Result() {
  const tabs = [
    {
      title: "Attributes",
    },
    {
      title: "Recommendations",
    },
  ];

  const [selectedTab, setTab] = useState(tabs[0].title);

  const { setPage } = usePage();
  const { criterias } = useCamera();

  const [inferenceResult, setInferenceResult] = useState<Classifier[] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inferenceError, setInferenceError] = useState<string | null>(null);
  const [isInferenceRunning, setIsInferenceRunning] = useState<boolean>(false);

  useEffect(() => {
    const performInference = async () => {
      if (criterias.isCaptured && criterias.capturedImage) {
        setIsInferenceRunning(true);
        setIsLoading(true);
        setInferenceError(null);
        try {
          const personalityResult: Classifier[] = await personalityInference(
            criterias.capturedImage,
            224,
            224,
          );
          setInferenceResult(personalityResult);
        } catch (error: any) {
          console.error("Inference error:", error);
          setInferenceError(
            error.message || "An error occurred during inference.",
          );
        } finally {
          setIsLoading(false);
          setIsInferenceRunning(false);
        }
      }
    };

    performInference();
  }, []);

  return (
    <div className="flex flex-col h-screen font-sans text-white bg-black">
      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-2">
        <button className="size-6">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button type="button" className="size-6" onClick={() => setPage(null)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex items-start px-5 py-6 space-x-1">
        <div className="px-5 shrink-0">
          <div className="flex items-center justify-center rounded-full bg-gradient-to-b from-[#CA9C43] to-[#644D21] p-1">
            {criterias.capturedImage ? (
              <img
                className="object-fill rounded-full size-24"
                src={criterias.capturedImage}
                alt="Captured Profile"
              />
            ) : (
              <img
                className="rounded-full size-24"
                src="https://avatar.iran.liara.run/public/30"
                alt="Profile"
              />
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-1">
            <Icons.hashtagCircle className="size-4" />
            <div className="text-sm">AI Face Analzer :</div>
          </div>
        </div>
      </div>

      {/* Tabs */}

      <div className="mx-auto w-full max-w-[430px] px-5">
        <div className="flex border-b-2 border-white/50">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={clsx(
                "w-full translate-y-0.5 border-b-2 py-2",
                tab.title === selectedTab
                  ? "border-[#CA9C43] bg-gradient-to-r from-[#92702D] to-[#CA9C43] bg-clip-text text-transparent"
                  : "border-transparent",
              )}
              onClick={() => setTab(tab.title)}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {selectedTab === "Attributes" ? (
        <AttributesTab data={inferenceResult} />
      ) : null}
      {selectedTab === "Recommendations" ? (
        <RecommendationsTab
          faceShape={inferenceResult ? inferenceResult[14].outputLabel : ""}
        />
      ) : null}
    </div>
  );
}

function PersonalitySection({
  title,
  description,
  score,
}: {
  title: string;
  description: string;
  score: number;
}) {
  // High -> 70% - 100%
  // Moderate -> above 40% - 69%
  // low -> 0% - 39%
  const scoreType = score < 40 ? "Low" : score < 70 ? "Moderate" : "High";
  return (
    <div className="py-5">
      <div className="flex items-center pb-6 space-x-2">
        <Icons.personalityTriangle className="size-8" />

        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>

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
    </div>
  );
}

function RecommendationsTab({ faceShape }: { faceShape: string }) {
  const { data: fragrances } = useFragrancesProductQuery({
    faceShape,
  });
  const { data: lips } = useLipsProductQuery({
    faceShape,
  });

  const { data: items } = useLookbookProductQuery({
    faceShape,
  });

  return (
    <div className="w-full px-4 py-8 overflow-auto">
      <div className="pb-14">
        <h2 className="pb-4 text-xl font-bold">Perfumes Recommendations</h2>
        {fragrances ? (
          <div className="flex w-full gap-4 overflow-x-auto no-scrollbar">
            {fragrances.items.map((product, index) => {
              const imageUrl =
                mediaUrl(product.media_gallery_entries[0].file) ??
                "https://picsum.photos/id/237/200/300";

              return (
                <div key={product.id} className="w-[150px] rounded">
                  <div className="relative h-[150px] w-[150px] overflow-hidden">
                    <img
                      src={imageUrl}
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
                        <BrandName
                          brandId={getProductAttributes(product, "brand")}
                        />
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-x-1">
                      <span className="text-sm font-bold text-white">
                        ${product.price}
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
              );
            })}
          </div>
        ) : (
          <LoadingProducts />
        )}
      </div>
      <div className="pb-14">
        <h2 className="text-xl font-bold">Look Recommendations</h2>
        <p className="pb-4 text-sm font-bold">
          A bold red lipstick and defined brows, mirror your strong, vibrant
          personality
        </p>
        {items ? (
          <div className="flex w-full gap-4 overflow-x-auto no-scrollbar">
            {items.items.map((product, index) => {
              const imageUrl =
                mediaUrl(product.media_gallery_entries[0].file) ??
                "https://picsum.photos/id/237/200/300";

              return (
                <div key={product.id} className="w-[150px] rounded">
                  <div className="relative h-[150px] w-[150px] overflow-hidden">
                    <img
                      src={imageUrl}
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
                        <BrandName
                          brandId={getProductAttributes(product, "brand")}
                        />
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-x-1">
                      <span className="text-sm font-bold text-white">
                        ${product.price}
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
              );
            })}
          </div>
        ) : (
          <LoadingProducts />
        )}
      </div>
      <div className="pb-14">
        <h2 className="text-xl font-bold">Lip Color Recommendations</h2>
        <p className="pb-4 text-sm font-bold">
          The best lip color for you are orange shades
        </p>
        {lips ? (
          <div className="flex w-full gap-4 overflow-x-auto no-scrollbar">
            {lips.items.map((product, index) => {
              const imageUrl =
                mediaUrl(product.media_gallery_entries[0].file) ??
                "https://picsum.photos/id/237/200/300";

              return (
                <div key={product.id} className="w-[150px] rounded">
                  <div className="relative h-[150px] w-[150px] overflow-hidden">
                    <img
                      src={imageUrl}
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
                        <BrandName
                          brandId={getProductAttributes(product, "brand")}
                        />
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-x-1">
                      <span className="text-sm font-bold text-white">
                        ${product.price}
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
              );
            })}
          </div>
        ) : (
          <LoadingProducts />
        )}
      </div>
    </div>
  );
}

function AttributesTab({ data }: { data: Classifier[] | null }) {
  if (!data) {
    return <div></div>;
  }

  return (
    <div className="grid flex-1 grid-cols-1 gap-4 px-10 py-6 space-y-6 overflow-auto md:grid-cols-2">
      <FeatureSection
        icon={<Icons.face className="size-12" />}
        title="Face"
        features={[
          { name: "Face Shape", value: data[14].outputLabel },
          { name: "Skin Tone", value: "Dark latte" },
        ]}
      />
      <FeatureSection
        icon={<Icons.eye className="size-12" />}
        title="Eyes"
        features={[
          { name: "Eye Shape", value: data[3].outputLabel },
          { name: "Eye Size", value: data[4].outputLabel },
          { name: "Eye Angle", value: data[1].outputLabel },
          { name: "Eye Distance", value: data[2].outputLabel },
          { name: "Eyelid", value: data[6].outputLabel },
          {
            name: "Eye Color",
            value: "",
            color: true,
            hex: data[18].outputColor,
          },
        ]}
      />
      <FeatureSection
        icon={<Icons.brows className="size-12" />}
        title="Brows"
        features={[
          { name: "Eyebrow Shape", value: data[13].outputLabel },
          { name: "Thickness", value: data[11].outputLabel },
          { name: "Eyebrow Distance", value: data[5].outputLabel },
          {
            name: "Eyebrow color",
            value: "",
            color: true,
            hex: data[18].outputColor,
          },
        ]}
      />
      <FeatureSection
        icon={<Icons.lips className="size-12" />}
        title="Lips"
        features={[
          { name: "Lip shape", value: data[14].outputLabel },
          {
            name: "Lip color",
            value: "",
            color: true,
            hex: data[17].outputColor,
          },
        ]}
      />
      <FeatureSection
        icon={<Icons.cheekbones className="size-12" />}
        title="Cheekbones"
        features={[{ name: "cheekbones", value: data[0].outputLabel }]}
      />
      <FeatureSection
        icon={<Icons.nose className="size-12" />}
        title="Nose"
        features={[{ name: "Nose Shape", value: data[9].outputLabel }]}
      />
      <FeatureSection
        icon={<Icons.hair className="size-12" />}
        title="Hair"
        features={[{ name: "Face Shape", value: data[10].outputLabel }]}
      />
    </div>
  );
}

function FeatureSection({
  icon,
  title,
  features,
}: {
  icon: ReactNode;
  title: string;
  features: {
    name: string;
    value: string;
    color?: boolean;
    hex?: string;
  }[];
}) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center pb-5 space-x-2">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-3xl font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="">
            <div className="text-xl font-bold">{feature.name}</div>
            {feature.color ? (
              <div
                className="h-6 w-ful"
                style={{ backgroundColor: feature.hex }}
              ></div>
            ) : (
              <div className="text-sm">{feature.value}</div>
            )}
          </div>
        ))}
      </div>
      <div className="flex-1 py-4 border-b border-white/50"></div>
    </div>
  );
}

function RecorderStatus() {
  const { isRecording, formattedTime, handleStartPause, handleStop, isPaused } =
    useRecordingControls();

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
        onClick={isRecording ? handleStop : handleStartPause}
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
