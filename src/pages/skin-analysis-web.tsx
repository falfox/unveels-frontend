import { useEffect, useState, useRef } from "react";
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
import * as tf from "@tensorflow/tfjs-core";
import * as tflite from "@tensorflow/tfjs-tflite";
import { loadTFLiteModel } from "../utils/tfliteInference";
import { useModelLoader } from "../hooks/useModelLoader";
import { ModelLoadingScreen } from "../components/model-loading-screen";

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

  // Menggunakan useRef untuk model
  const modelSkinAnalysisRef = useRef<tflite.TFLiteModel | null>(null);

  const {
    isLoading,
    setIsLoading,
    setIsInferenceFinished,
    setInferenceError,
    setIsInferenceRunning,
  } = useInferenceContext();

  const [inferenceResult, setInferenceResult] = useState<FaceResults[] | null>(
    null,
  );

  const { setSkinAnalysisResult } = useSkinAnalysis();

  const steps = [
    async () => {
      const model = await loadTFLiteModel(
        "/models/skin-analysis/best_skin_float16.tflite",
      );
      modelSkinAnalysisRef.current = model;
    },
    async () => {
      if (modelSkinAnalysisRef.current) {
        modelSkinAnalysisRef.current.predict(
          tf.zeros([1, 640, 640, 3], "float32"),
        );
      }
    },
  ];

  const {
    progress,
    isLoading: modelLoading,
    loadModels,
  } = useModelLoader(steps);

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    const faceAnalyzerInference = async () => {
      if (criterias.isCaptured && criterias.capturedImage && !isLoading) {
        if ((window as any).flutter_inappwebview) {
          (window as any).flutter_inappwebview
            .callHandler("detectionRun", "Detection Running Skin Analysis")
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
          if (modelSkinAnalysisRef.current) {
            const skinAnalysisResult: [FaceResults[], SkinAnalysisResult[]] =
              await skinAnalysisInference(
                criterias.capturedImage,
                modelSkinAnalysisRef.current,
              );

            if (skinAnalysisResult) {
              console.log("Skin Analysis Result:", skinAnalysisResult[1]);

              // Konversi hasil ke JSON untuk log/debug
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
    <>
      {modelLoading && <ModelLoadingScreen progress={progress} />}
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
    </>
  );
}
