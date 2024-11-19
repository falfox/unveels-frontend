import clsx from "clsx";
import {
  ChevronLeft,
  CirclePlay,
  Heart,
  PauseCircle,
  StopCircle,
  X,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useSkincareProductQuery } from "../api/skin-care";
import { CircularProgressRings } from "../components/circle-progress-rings";
import { Footer } from "../components/footer";
import { Icons } from "../components/icons";
import { LoadingProducts } from "../components/loading";
import { BrandName } from "../components/product/brand";
import { VideoScene } from "../components/recorder/recorder";
import { CameraProvider, useCamera } from "../context/recorder-context";
import { VideoStream } from "../components/recorder/video-stream";
import { ShareModal } from "../components/share-modal";
import { SkinAnalysisScene } from "../components/skin-analysis/skin-analysis-scene";
import { useRecordingControls } from "../hooks/useRecorder";
import { skinAnalysisInference } from "../inference/skinAnalysisInference";
import { FaceResults } from "../types/faceResults";
import {
  SkinAnalysisProvider,
  useSkinAnalysis,
} from "../context/skin-analysis-context";
import { SkinAnalysisResult } from "../types/skinAnalysisResult";
import { getProductAttributes, mediaUrl } from "../utils/apiUtils";
import { labelsDescription } from "../utils/constants";
import { TopNavigation } from "../components/top-navigation";
import {
  InferenceProvider,
  useInferenceContext,
} from "../context/inference-context";
import { useTranslation } from "react-i18next";

export function SkinAnalysis() {
  return (
    <CameraProvider>
      <InferenceProvider>
        <SkinAnalysisProvider>
          <div className="h-full min-h-dvh">
            <Main />
          </div>
        </SkinAnalysisProvider>
      </InferenceProvider>
    </CameraProvider>
  );
}

function Main() {
  const { criterias } = useCamera();

  const {
    isLoading,
    setIsLoading,
    setIsInferenceFinished,
    isInferenceFinished,
    setInferenceError,
    setIsInferenceRunning,
  } = useInferenceContext();

  const [inferenceResult, setInferenceResult] = useState<FaceResults[] | null>(
    null,
  );
  const { setSkinAnalysisResult } = useSkinAnalysis();

  useEffect(() => {
    const faceAnalyzerInference = async () => {
      if (criterias.isCaptured && criterias.capturedImage && !isLoading) {
        setIsInferenceRunning(true);
        setIsLoading(true);
        setInferenceError(null);
        try {
          const skinAnalysisResult: [FaceResults[], SkinAnalysisResult[]] =
            await skinAnalysisInference(criterias.capturedImage);

          setInferenceResult(skinAnalysisResult[0]);
          setSkinAnalysisResult(skinAnalysisResult[1]);
          console.log(skinAnalysisResult[1]);
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

    faceAnalyzerInference();
  }, [criterias.isCaptured, criterias.capturedImage]);

  return (
    <div className="relative mx-auto h-full min-h-dvh w-full bg-black">
      <div className="absolute inset-0">
        {!isLoading && inferenceResult != null ? (
          <SkinAnalysisScene data={inferenceResult} />
        ) : (
          <>
            <VideoStream />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
                zIndex: 0,
              }}
            ></div>
          </>
        )}
      </div>
      <RecorderStatus />
      <TopNavigation item={isInferenceFinished} />

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

  return <BottomContent />;
}

const tabs = [
  "acne",
  "blackhead",
  "dark circles",
  "droopy lower eyelid",
  "droopy upper eyelid",
  "dry",
  "eyebags",
  "firmness",
  "moisture",
  "oily",
  "pores",
  "radiance",
  "redness",
  "spots",
  "texture",
  "whitehead",
  "wrinkles",
] as const;

function SkinProblems({ onClose }: { onClose: () => void }) {
  const { tab, setTab, getTotalScoreByLabel } = useSkinAnalysis();
  const { t } = useTranslation();

  return (
    <>
      <div
        className="fixed inset-0 h-full w-full"
        onClick={() => {
          onClose();
        }}
      ></div>
      <div className="relative space-y-2 px-4 pb-4">
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
                  {t(`skinlabel.${problemTab}`)}

                  <div
                    className={clsx(
                      "absolute inset-x-0 -top-6 text-center text-white",
                      {
                        hidden: !isActive,
                      },
                    )}
                  >
                    {tab ? `${getTotalScoreByLabel(tab)}%` : "0%"}
                  </div>
                </button>
              </Fragment>
            );
          })}
        </div>

        <div className="px-8">
          {tab && <DescriptionText text={labelsDescription[tab]} />}
        </div>

        {tab && <ProductList skinConcern={tab} />}
      </div>
    </>
  );
}

function DescriptionText({ text }: { text: string }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="py-5">
      <h4 className="pb-1 text-xl font-bold text-white">
        {t("viewskinan.description")}
      </h4>
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
        {expanded ? t("viewskinan.Less") : t("viewskinan.Readmore")}
      </button>
    </div>
  );
}

function ProductList({ skinConcern }: { skinConcern: string }) {
  const { t } = useTranslation();
  const { data } = useSkincareProductQuery({
    skinConcern,
  });

  return (
    <div className="flex w-full gap-4 overflow-x-auto no-scrollbar active:cursor-grabbing">
      {data ? (
        data.items.map((product, index) => {
          const imageUrl =
            mediaUrl(product.media_gallery_entries[0].file) ??
            "https://picsum.photos/id/237/200/300";

          return (
            <div key={product.id} className="w-[115px] rounded shadow">
              <div className="relative h-[80px] w-[115px] overflow-hidden">
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
                <p className="text-[0.5rem] text-white/60">
                  <BrandName brandId={getProductAttributes(product, "brand")} />
                </p>
                <div className="flex flex-wrap items-center justify-end gap-x-1">
                  <span className="text-[0.625rem] font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  {/* <span className="text-[0.5rem] text-white/50 line-through">
              ${product.originalPrice.toFixed(2)}
            </span> */}
                </div>
              </div>
              <div className="flex space-x-1 pt-1">
                <button
                  type="button"
                  className="flex h-7 w-full items-center justify-center border border-white text-[0.375rem] font-semibold text-white"
                >
                  {t("viewskinan.addcart")}
                </button>
                <button
                  type="button"
                  className="flex h-7 w-full items-center justify-center border border-white bg-white text-[0.45rem] font-semibold text-black"
                >
                  {t("viewskinan.seeimprovement")}
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <LoadingProducts />
      )}
    </div>
  );
}

function BottomContent() {
  const { criterias, setCriterias } = useCamera();
  const { view, setView } = useSkinAnalysis();

  if (criterias.isCaptured) {
    if (view === "face") {
      return <ProblemResults />;
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

function ProblemResults() {
  const { t } = useTranslation();
  const { view, setView } = useSkinAnalysis();
  return (
    <>
      <div className="absolute inset-x-0 bottom-32 flex items-center justify-center">
        <button
          type="button"
          className="bg-black px-10 py-3 text-sm text-white"
          onClick={() => {
            setView("results");
          }}
        >
          {t("viewskinan.analysis_result")}
        </button>
      </div>
    </>
  );
}

function AnalysisResults({ onClose }: { onClose: () => void }) {
  const {
    calculateSkinHealthScore,
    calculateAverageSkinConditionScore,
    calculateAverageSkinProblemsScore,
    getTotalScoreByLabel,
  } = useSkinAnalysis();

  const { t } = useTranslation();
  const { criterias } = useCamera();

  return (
    <div
      className={clsx(
        "fixed inset-0 flex h-dvh flex-col bg-black font-sans text-white",
      )}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between px-4 py-2">
        <button className="size-6">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button type="button" className="size-6" onClick={() => onClose()}>
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-end space-x-2.5 px-5">
          <Heart className="size-6" />
          <Icons.bag className="size-6" />
        </div>

        <h1 className="bg-[linear-gradient(89.39deg,#92702D_0.52%,#CA9C43_99.44%)] bg-clip-text text-3xl font-medium text-transparent">
          {t("viewskinan.analysis_result")}
        </h1>
      </div>

      {/* Profile Section */}
      <div className="flex items-center space-x-1 px-5 py-2">
        <div className="shrink-0 px-5">
          <div className="flex items-center justify-center rounded-full bg-gradient-to-b from-[#CA9C43] to-[#644D21] p-1">
            {criterias.capturedImage ? (
              <img
                className="size-24 rounded-full object-fill"
                src={criterias.capturedImage}
                alt="Captured Profile"
              />
            ) : (
              <img
                className="size-24 rounded-full"
                src="https://avatar.iran.liara.run/public/30"
                alt="Profile"
              />
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <Icons.chart className="size-5" />
            <div className="text-lg">
              {t("viewskinan.skin_health")} {calculateSkinHealthScore()}%
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <Icons.hashtagCircle className="size-5" />
            <div className="text-lg">
              {t("viewskinan.skin_age")}{" "}
              {Math.floor(Math.random() * (64 - 20 + 1)) + 20}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <h2 className="text-center text-xl font-medium">
          {t("viewskinan.detected_skin")}
        </h2>

        <div className="relative pt-8">
          <CircularProgressRings
            className="mx-auto size-96"
            data={[
              { percentage: getTotalScoreByLabel("acne"), color: "#F72585" },
              { percentage: getTotalScoreByLabel("texture"), color: "#E9A0DD" },
              { percentage: getTotalScoreByLabel("pores"), color: "#F4EB24" },
              { percentage: getTotalScoreByLabel("spots"), color: "#0F38CC" },
              { percentage: getTotalScoreByLabel("eyebags"), color: "#00E0FF" },
              {
                percentage: getTotalScoreByLabel("dark circles"),
                color: "#6B13B1",
              },
              {
                percentage: getTotalScoreByLabel("wrinkles"),
                color: "#00FF38",
              },
            ]}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
            <div className="text-xl font-bold">
              {calculateAverageSkinProblemsScore()}%
            </div>
            <div className="">{t("viewskinan.skin_problem")}</div>
          </div>
        </div>

        <div className="flex items-start justify-between space-x-4 bg-black px-10 text-white">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#00FF38] text-sm font-bold text-white">
                {getTotalScoreByLabel("texture")}%
              </div>
              <span>{t("skinlabel.texture")}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#6B13B1] text-sm font-bold text-white">
                {getTotalScoreByLabel("dark circles")}%
              </div>
              <span>{t("skinlabel.dark circles")}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#00E0FF] text-sm font-bold text-white">
                {getTotalScoreByLabel("eyebags")}%
              </div>
              <span>{t("skinlabel.eyebags")}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0F38CC] text-sm font-bold text-white">
                {getTotalScoreByLabel("wrinkles")}%
              </div>
              <span>{t("skinlabel.wrinkles")}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F4EB24] text-sm font-bold text-white">
                {getTotalScoreByLabel("pores")}%
              </div>
              <span>{t("skinlabel.pores")}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E9A0DD] text-sm font-bold text-white">
                {getTotalScoreByLabel("spots")}%
              </div>
              <span>{t("skinlabel.spots")}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F72585] text-sm font-bold text-white">
                {getTotalScoreByLabel("acne")}%
              </div>
              <span>{t("skinlabel.acne")}</span>
            </div>
          </div>
        </div>

        <h2 className="pt-12 text-center text-xl font-medium">
          {t("viewskinan.detected_skin_con")}
        </h2>

        <div className="relative pt-8">
          <CircularProgressRings
            className="mx-auto size-96"
            data={[
              {
                percentage: getTotalScoreByLabel("moisture"),
                color: "#4CC9F0",
              },
              {
                percentage: getTotalScoreByLabel("redness"),
                color: "#BD8EFF",
              },
              { percentage: getTotalScoreByLabel("oily"), color: "#B5179E" },
              {
                percentage: getTotalScoreByLabel("moisture"),
                color: "#5DD400",
              },
              {
                percentage: getTotalScoreByLabel("droopy lower eyelid"),
                color: "#14A086",
              },
              {
                percentage: getTotalScoreByLabel("droopy upper eyelid"),
                color: "#F72585",
              },
              {
                percentage: getTotalScoreByLabel("firmness"),
                color: "#F1B902",
              },
            ]}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
            <div className="text-xl font-bold">
              {calculateAverageSkinConditionScore()}%
            </div>
            <div className="">{t("viewskinan.skin_problem")}</div>
          </div>
        </div>

        <div className="flex items-start justify-between space-x-4 bg-black px-10 text-white">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F1B902] text-sm font-bold text-white">
                {getTotalScoreByLabel("firmness")}%
              </div>
              <span>{t("skinlabel.firmness")}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F72585] text-sm font-bold text-white">
                {getTotalScoreByLabel("droopy upper eyelid")}%
              </div>
              <span>{t("skinlabel.droopy upper eyelid")}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#14A086] text-sm font-bold text-white">
                {getTotalScoreByLabel("droopy lower eyelid")}%
              </div>
              <span>{t("skinlabel.droopy lower eyelid")}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#5DD400] text-sm font-bold text-white">
                {getTotalScoreByLabel("moisture")}%
              </div>
              <span>{t("skinlabel.moisture")}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#B5179E] text-sm font-bold text-white">
                {getTotalScoreByLabel("oily")}%
              </div>
              <span>{t("skinlabel.oily")}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#BD8EFF] text-sm font-bold text-white">
                {getTotalScoreByLabel("redness")}%
              </div>
              <span>{t("skinlabel.redness")}</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#4CC9F0] text-sm font-bold text-white">
                {getTotalScoreByLabel("radiance")}%
              </div>
              <span>{t("skinlabel.radiance")}</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/50 px-2 py-10 text-white">
          <ProblemSection
            title="Wrinkles"
            detected="Forehead: Mild spots observed, likely due to sun exposure.Cheeks: A few dark spots noted on both cheeks, possibly post-inflammatory hyperpigmentation"
            description="Wrinkles are a natural part of aging, but they can also develop as a result of sun exposure, dehydration, and smoking. They can be treated with topical creams, botox, and fillers."
            score={getTotalScoreByLabel("wrinkles")}
          />
          <ProblemSection
            title="Spots"
            detected="Forehead: Mild spots observed, likely due to sun exposure.Cheeks: A few dark spots noted on both cheeks, possibly post-inflammatory hyperpigmentation"
            description="Spots can be caused by sun exposure, hormonal changes, and skin inflammation. They can be treated with topical creams, laser therapy, and chemical peels."
            score={getTotalScoreByLabel("spots")}
          />
          <ProblemSection
            title="Texture"
            detected="Detected"
            description="Uneven skin texture can be caused by acne, sun damage, and aging. It can be treated with exfoliation, laser therapy, and microneedling."
            score={getTotalScoreByLabel("texture")}
          />
          <ProblemSection
            title="Dark Circles"
            detected="Detected"
            description="Dark circles can be caused by lack of sleep, dehydration, and genetics. They can be treated with eye creams, fillers, and laser therapy."
            score={getTotalScoreByLabel("dark circles")}
          />
          <ProblemSection
            title="Redness"
            detected="Detected"
            description="Redness can be caused by rosacea, sunburn, and skin sensitivity. It can be treated with topical creams, laser therapy, and lifestyle changes."
            score={getTotalScoreByLabel("redness")}
          />
          <ProblemSection
            title="Oily"
            detected="Detected"
            description="Oiliness can be caused by hormonal changes, stress, and genetics. It can be treated with oil-free skincare products, medication, and lifestyle changes."
            score={getTotalScoreByLabel("oily")}
          />
          <ProblemSection
            title="Moisture"
            detected="Detected"
            description="Dry skin can be caused by cold weather, harsh soaps, and aging. It can be treated with moisturizers, humidifiers, and lifestyle changes."
            score={getTotalScoreByLabel("moisture")}
          />
          <ProblemSection
            title="Pores"
            detected="Detected"
            description="Large pores can be caused by genetics, oily skin, and aging. They can be treated with topical creams, laser therapy, and microneedling."
            score={getTotalScoreByLabel("pores")}
          />
          <ProblemSection
            title="Eyebags"
            detected="Detected"
            description="Eye bags can be caused by lack of sleep, allergies, and aging. They can be treated with eye creams, fillers, and surgery."
            score={getTotalScoreByLabel("eyebags")}
          />
          <ProblemSection
            title="Radiance"
            detected="Detected"
            description="Dull skin can be caused by dehydration, poor diet, and lack of sleep. It can be treated with exfoliation, hydration, and lifestyle changes."
            score={getTotalScoreByLabel("radiance")}
          />
          <ProblemSection
            title="Firmness"
            detected="Detected"
            description="Loss of firmness can be caused by aging, sun exposure, and smoking. It can be treated with topical creams, botox, and fillers."
            score={getTotalScoreByLabel("firmness")}
          />
          <ProblemSection
            title="Droopy Upper Eyelid"
            detected="Detected"
            description="Droopy eyelids can be caused by aging, genetics, and sun exposure. They can be treated with eyelid surgery, botox, and fillers."
            score={getTotalScoreByLabel("dropy upper eyelid")}
          />
          <ProblemSection
            title="Droopy Lower Eyelid"
            detected="Detected"
            description="Droopy eyelids can be caused by aging, genetics, and sun exposure. They can be treated with eyelid surgery, botox, and fillers."
            score={getTotalScoreByLabel("dropy lower eyelid")}
          />
          <ProblemSection
            title="Acne"
            detected="Detected"
            description="Acne can be caused by hormonal changes, stress, and genetics. It can be treated with topical creams, medication, and lifestyle changes."
            score={getTotalScoreByLabel("acne")}
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
  const { t } = useTranslation();
  // High -> 70% - 100%
  // Moderate -> above 40% - 69%
  // low -> 0% - 39%
  const scoreType = score < 40 ? "Low" : score < 70 ? "Moderate" : "High";
  return (
    <div className="py-5">
      <div className="flex items-center space-x-2 pb-6">
        <Icons.personalityTriangle className="size-8 shrink-0" />

        <h2 className="text-3xl font-bold text-white">
          {t(`skinlabel.${title.toLocaleLowerCase()}`).toLocaleUpperCase()}
        </h2>
      </div>
      <span className="text-xl font-bold">{t("viewskinan.detected")}</span>
      <p className="pb-6 pt-1 text-sm">{detected}</p>
      <div className="pt-6"></div>
      <span className="text-xl font-bold">{t("viewskinan.description")}</span>
      <p className="pb-6 pt-1 text-sm">{description}</p>
      <span className="text-xl font-bold">{t("viewskinan.score")}</span>
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
        {t(`scoreTypes.${scoreType.toLocaleLowerCase()}`)} {score}%
      </div>

      <div className="py-8">
        <h2 className="pb-4 text-xl font-bold">{t("viewskinan.recomend")}</h2>

        <ProductList skinConcern={title} />
      </div>
    </div>
  );
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
