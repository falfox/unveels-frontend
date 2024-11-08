import { useState, useEffect } from "react";
import { Footer } from "../components/footer";
import { VideoScene } from "../components/recorder/recorder";
import { CameraProvider, useCamera } from "../context/recorder-context";
import { VideoStream } from "../components/recorder/video-stream";
import { personalityInference } from "../inference/personalityInference";
import { Classifier } from "../types/classifier";
import { InferenceProvider } from "../context/inference-context";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import * as tf from "@tensorflow/tfjs-core";
import * as tflite from "@tensorflow/tfjs-tflite";
import { loadTFLiteModel } from "../utils/tfliteInference";

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
  const [modelFaceShape, setModelFaceShape] =
    useState<tflite.TFLiteModel | null>(null);

  const [modelPersonalityFinder, setModelPersonalityFinder] =
    useState<tflite.TFLiteModel | null>(null);

  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(
    null,
  );

  const { criterias } = useCamera();

  const [inferenceResult, setInferenceResult] = useState<Classifier[] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inferenceError, setInferenceError] = useState<string | null>(null);
  const [isInferenceRunning, setIsInferenceRunning] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const dummyInput = tf.zeros([1, 224, 224, 3], "float32");

    const loadModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
        );

        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          minFaceDetectionConfidence: 0.7,
          minFacePresenceConfidence: 0.7,
          minTrackingConfidence: 0.7,
          runningMode: "IMAGE",
          numFaces: 1,
        });

        setModelFaceShape(
          await loadTFLiteModel(
            "/models/personality-finder/face-analyzer.tflite",
          ),
        );
        setModelPersonalityFinder(
          await loadTFLiteModel(
            "/models/personality-finder/personality_finder.tflite",
          ),
        );

        if (isMounted) {
          setFaceLandmarker(faceLandmarker);
          // warmup
          modelFaceShape?.predict(dummyInput);
          modelPersonalityFinder?.predict(dummyInput);
          modelFaceShape?.predict(dummyInput);
          modelPersonalityFinder?.predict(dummyInput);
        }
      } catch (error) {
        console.error("Failed to initialize: ", error);
      }
    };

    loadModel();

    return () => {
      isMounted = false;
      if (faceLandmarker) {
        faceLandmarker.close();
      }
      if (modelPersonalityFinder && modelFaceShape) {
        dummyInput.dispose();
      }
    };
  }, []);

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
          if (modelFaceShape && modelPersonalityFinder && faceLandmarker) {
            const personalityResult: Classifier[] = await personalityInference(
              modelFaceShape,
              modelPersonalityFinder,
              faceLandmarker,
              criterias.capturedImage,
              224,
              224,
            );
            setInferenceResult(personalityResult);

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
          }
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
