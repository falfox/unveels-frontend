import { useEffect, useState } from "react";
import { Footer } from "../components/footer";
import { VideoStream } from "../components/recorder/video-stream";
import SkinAnalysisScene from "../components/skin-analysis/skin-analysis-scene";
import {
  InferenceProvider,
  useInferenceContext,
} from "../context/inference-context";
import { CameraProvider, useCamera } from "../context/recorder-context";
import {
  SkinAnalysisProvider,
  useSkinAnalysis,
} from "../context/skin-analysis-context";
import { FaceResults } from "../types/faceResults";
import { SkinAnalysisResult } from "../types/skinAnalysisResult";
import { skinAnalysisInference } from "../inference/skinAnalysisInference";
import { VideoScene } from "../components/recorder/recorder";

export function SkinAnalysisWeb() {
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
        if ((window as any).flutter_inappwebview) {
          (window as any).flutter_inappwebview
            .callHandler(
              "detectionRun",
              "Detection Running Personality Finder / Face Analyzer",
            )
            .then((result: any) => {
              console.log("Flutter responded with:", result);
            })
            .catch((error: any) => {
              console.error("Error calling Flutter handler:", error);
            });
        }
        setIsInferenceRunning(true);
        setIsLoading(true);
        setInferenceError(null);
        try {
          const skinAnalysisResult: [FaceResults[], SkinAnalysisResult[]] =
            await skinAnalysisInference(criterias.capturedImage);

          if (skinAnalysisResult) {
            console.log("Skin Analysis Result:", skinAnalysisResult[1]);

            // Coba stringify hasilnya
            const resultString = JSON.stringify(skinAnalysisResult[1]);
            console.log("Skin Analysis Result as JSON:", resultString);

            setInferenceResult(skinAnalysisResult[0]);
            setSkinAnalysisResult(skinAnalysisResult[1]);

            if ((window as any).flutter_inappwebview) {
              (window as any).flutter_inappwebview
                .callHandler("detectionResult", resultString)
                .then((result: any) => {
                  console.log("Flutter responded with:", result);
                })
                .catch((error: any) => {
                  console.error("Error calling Flutter handler:", error);
                });
            }
          }
        } catch (error: any) {
          if ((window as any).flutter_inappwebview) {
            (window as any).flutter_inappwebview
              .callHandler("detectionError", error)
              .then((result: any) => {
                console.log("Flutter responded with:", result);
              })
              .catch((error: any) => {
                console.error("Error calling Flutter handler:", error);
              });
          }
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

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0">
        <VideoScene />
        <Footer />
      </div>
    </div>
  );
}
