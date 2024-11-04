import { useState, useEffect } from "react";
import { Footer } from "../components/footer";
import { VideoScene } from "../components/recorder/recorder";
import { CameraProvider, useCamera } from "../context/recorder-context";
import { VideoStream } from "../components/recorder/video-stream";
import { personalityInference } from "../inference/personalityInference";
import { Classifier } from "../types/classifier";
import { InferenceProvider } from "../context/inference-context";

export function PersonalityFinderWeb() {
  return (
    <CameraProvider>
      <InferenceProvider>
        <div className="h-full min-h-dvh">
          <MainContent />
        </div>
      </InferenceProvider>
    </CameraProvider>
  );
}

function MainContent() {
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
        setIsInferenceRunning(true);
        setIsLoading(true);
        setInferenceError(null);
        try {
          const personalityResult: Classifier[] = await personalityInference(
            criterias.capturedImage,
            224,
            224,
          );

          if (personalityResult != null) {
            console.log("Personality Result:", personalityResult);

            // Coba stringify hasilnya
            const resultString = JSON.stringify(personalityResult);
            console.log("Personality Result as JSON:", resultString);

            // Kirim data sebagai JSON string
            (window as any).flutter_inappwebview
              .callHandler("detectionResult", resultString)
              .then((result: any) => {
                console.log("Flutter responded with:", result);
              })
              .catch((error: any) => {
                console.error("Error calling Flutter handler:", error);
              });
          }
          setInferenceResult(personalityResult);
        } catch (error: any) {
          (window as any).flutter_inappwebview
            .callHandler("detectionError", error)
            .then((result: any) => {
              console.log("Flutter responded with:", result);
            })
            .catch((error: any) => {
              console.error("Error calling Flutter handler:", error);
            });
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
  }, [criterias.isCaptured]);

  return (
    <div className="relative mx-auto h-full min-h-dvh w-full bg-pink-950">
      <div className="absolute inset-0">
        <VideoStream debugMode={false} />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)`,
          }}
        ></div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0">
        <VideoScene />
        <Footer />
      </div>
    </div>
  );
}
