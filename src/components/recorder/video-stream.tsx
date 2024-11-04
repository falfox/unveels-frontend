import { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import { useCamera } from "../../context/recorder-context";
import {
  BRIGHTNESS_THRESHOLD,
  POSITION_THRESHOLD_X,
  POSITION_THRESHOLD_Y,
  ORIENTATION_THRESHOLD_YAW,
  ORIENTATION_THRESHOLD_PITCH,
} from "../../utils/constants";
import { calculateLighting, cropImage } from "../../utils/imageProcessing";
import { CountdownOverlay } from "../countdown-overlay";
import { ErrorOverlay } from "../error-overlay";
import { useCountdown } from "../../hooks/useCountdown";
import { processBoundingBox } from "../../utils/boundingBoxUtils";
import { drawKeypoints } from "../../utils/keypointsUtils";
import {
  calculateOrientation,
  Orientation,
} from "../../utils/orientationUtils";

interface VideoStreamProps {
  debugMode?: boolean;
}

export function VideoStream({ debugMode = true }: VideoStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<Error | null>(null);
  const faceDetectorRef = useRef<FaceDetector | null>(null);
  const isDetectingRef = useRef<boolean>(false);

  // Using CameraContext
  const {
    webcamRef,
    criterias,
    setCriterias,
    flipCamera,
    captureImage,
    setBoundingBox,
    captureImageCut,
    resetCapture,
  } = useCamera();

  // State Variables for Metrics
  const [lighting, setLighting] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [orientation, setOrientation] = useState<Orientation>({
    yaw: 0,
    pitch: 0,
  });

  const memoizedPosition = useCallback(
    () => position,
    [position.x, position.y],
  );
  const memoizedOrientation = useCallback(
    () => orientation,
    [orientation.yaw, orientation.pitch],
  );

  // Debug Mode State
  const [isDebugMode, setIsDebugMode] = useState<boolean>(debugMode);

  // State for Captured Image
  const [capturedImageSrc, setCapturedImageSrc] = useState<string | null>(null);
  // Optional: State for Cropped Image
  const [croppedImageSrc, setCroppedImageSrc] = useState<string | null>(null);

  // Initialize MediaPipe Face Detector
  useEffect(() => {
    const initializeFaceDetector = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm",
        );
        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          minDetectionConfidence: 0.9,
          minSuppressionThreshold: 1,
        });
        faceDetectorRef.current = detector;
        startDetection();
      } catch (err) {
        console.error("Failed to initialize FaceDetector:", err);
        setError(err as Error);
      }
    };

    initializeFaceDetector();

    // Cleanup when component unmounts
    return () => {
      if (faceDetectorRef.current) {
        faceDetectorRef.current.close();
      }
      isDetectingRef.current = false;
    };
  }, []);

  // Function to start the detection loop
  const startDetection = useCallback(() => {
    if (isDetectingRef.current) return;
    isDetectingRef.current = true;

    const detect = async () => {
      if (
        faceDetectorRef.current &&
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        if (canvas) {
          // Get the rendered size and position of the video
          const videoRect = video.getBoundingClientRect();
          if (video && video.videoWidth > 0 && video.videoHeight > 0) {
            // Update canvas size and position to match the video
            if (
              canvas.width !== videoRect.width ||
              canvas.height !== videoRect.height
            ) {
              canvas.width = videoRect.width;
              canvas.height = videoRect.height;
            }

            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              const startTimeMs = performance.now();
              try {
                const detections = faceDetectorRef.current.detectForVideo(
                  video,
                  startTimeMs,
                ).detections;

                if (detections.length > 0) {
                  const highestScoreDetection = detections.reduce(
                    (max, detection) => {
                      return detection.categories[0].score >
                        max.categories[0].score
                        ? detection
                        : max;
                    },
                    detections[0],
                  );

                  const box = highestScoreDetection.boundingBox;
                  const keypoints = highestScoreDetection.keypoints;

                  if (box) {
                    // Refactored: Process Bounding Box
                    const { relativePosition } = processBoundingBox(
                      box,
                      video,
                      videoRect,
                      criterias.flipped,
                      setBoundingBox,
                      isDebugMode,
                      ctx,
                    );

                    setPosition(relativePosition);
                  }

                  if (isDebugMode && keypoints) {
                    // Refactored: Draw Keypoints
                    drawKeypoints(
                      keypoints,
                      video,
                      videoRect,
                      criterias.flipped,
                      canvas,
                      ctx,
                    );
                  }

                  // Calculate Orientation
                  const calculatedOrientation = calculateOrientation(keypoints);
                  setOrientation(calculatedOrientation);
                } else {
                  // No detections, reset metrics
                  setPosition({ x: 0, y: 0 });
                  setOrientation({ yaw: 0, pitch: 0 });
                  setLighting(0);
                }

                // Calculate Brightness
                if (video.readyState === 4) {
                  const avgBrightness = await calculateLighting(video);
                  setLighting(avgBrightness);
                }
              } catch (err) {
                console.error("Detection error:", err);
                setError(err as Error);
              }
            }
          }
        } else {
          console.error("Video element is not properly initialized");
        }
      }

      if (isDetectingRef.current) {
        requestAnimationFrame(detect);
      }
    };

    detect();
  }, [isDebugMode, criterias.flipped, setBoundingBox]);

  // Function to stop detection
  const stopDetection = () => {
    isDetectingRef.current = false;
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopDetection();
      // Removed countdownIntervalRef references
    };
  }, []);

  // Function to toggle camera (flip)
  const toggleFacingMode = () => {
    flipCamera();
  };

  // Handle responsive resizing using ResizeObserver
  useEffect(() => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const updateCanvasSize = () => {
      const videoRect = video.getBoundingClientRect();
      canvas.width = videoRect.width;
      canvas.height = videoRect.height;
    };

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(video);

    // Update initial size
    updateCanvasSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  /**
   * Evaluates whether the current metrics meet the defined criteria.
   * Updates CameraContext with the evaluation results
   */
  const evaluateCriteria = useCallback(() => {
    const isBrightnessGood = lighting > BRIGHTNESS_THRESHOLD;

    const isPositionGood =
      Math.abs(position.x) < POSITION_THRESHOLD_X &&
      Math.abs(position.y) < POSITION_THRESHOLD_Y;

    const isOrientationGood =
      Math.abs(orientation.yaw) < ORIENTATION_THRESHOLD_YAW &&
      Math.abs(orientation.pitch) < ORIENTATION_THRESHOLD_PITCH;

    setCriterias({
      lighting: isBrightnessGood,
      facePosition: isPositionGood,
      orientation: isOrientationGood,
    });

    return {
      brightness: isBrightnessGood,
      position: isPositionGood,
      orientation: isOrientationGood,
      allGood: isBrightnessGood && isPositionGood && isOrientationGood,
    };
  }, [
    lighting,
    position.x,
    position.y,
    orientation.pitch,
    orientation.yaw,
    setCriterias,
  ]);

  /**
   * Function to capture the current frame from the webcam and crop based on bounding box
   */
  const capture = useCallback(async () => {
    if (webcamRef.current && criterias.lastBoundingBox) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          const croppedImage = await cropImage(
            imageSrc,
            criterias.lastBoundingBox,
          );
          captureImage(imageSrc);
          captureImageCut(croppedImage);
          setCapturedImageSrc(imageSrc); // Set the captured image
          setCroppedImageSrc(croppedImage); // Optional: Set cropped image
          stopDetection(); // Optionally stop detection after capture
        } catch (error) {
          console.error("Error cropping image:", error);
        }
      }
    }
  }, [captureImage, criterias.lastBoundingBox]);

  // Initialize useCountdown hook
  const {
    count: countdown,
    start: startCountdown,
    cancel: cancelCountdown,
    isActive: isCountdownActive,
  } = useCountdown({
    initialCount: 3,
    onComplete: capture, // Callback when countdown finishes
  });

  // Use Effect to evaluate criteria and manage countdown
  useEffect(() => {
    const criteria = evaluateCriteria();

    if (criteria.allGood && !criterias.isCaptured && !isCountdownActive) {
      // Start the countdown
      startCountdown();
    } else if (!criteria.allGood && isCountdownActive) {
      // Criteria not met, cancel the countdown
      cancelCountdown();
    }
  }, [
    evaluateCriteria,
    isCountdownActive,
    criterias.isCaptured,
    startCountdown,
    cancelCountdown,
  ]);

  // Reset Capture state when new image is loaded
  useEffect(() => {
    if (!criterias.isCaptured) {
      setCapturedImageSrc(null);
      startDetection();
      resetCapture();
    }
  }, [criterias.isCaptured]);

  return (
    <div className="relative h-full w-full">
      {/* Render Captured Image if available */}
      {capturedImageSrc ? (
        <div className="relative h-full w-full">
          <img
            src={capturedImageSrc}
            alt="Captured"
            className="h-full w-full object-cover"
          />
          {/* Button to Retake Photo */}
          <button
            onClick={() => {
              setCapturedImageSrc(null);
              startDetection();
              resetCapture(); // Restart detection if needed
            }}
            className="absolute bottom-4 left-4 rounded bg-gray-700 px-4 py-2 text-white"
            aria-label="Retake Photo"
          >
            Retake Photo
          </button>
        </div>
      ) : (
        <>
          {/* Webcam Video */}
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            mirrored={false} // Mirroring handled via CSS
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: criterias.flipped ? "environment" : "user",
            }}
            onUserMediaError={(err) =>
              setError(
                err instanceof Error
                  ? err
                  : new Error("Webcam error occurred."),
              )
            }
            className={`h-full w-full object-cover ${
              criterias.flipped ? "scale-x-[-1]" : ""
            }`}
          />

          {/* Overlay Canvas */}
          <canvas
            ref={canvasRef}
            className={`pointer-events-none absolute left-0 top-0 ${
              isDebugMode ? "block" : "hidden"
            }`} // Hide canvas if not in debug mode
            style={{
              width: "100%",
              height: "100%",
            }}
          />

          {/* Countdown Overlay */}
          {countdown !== null && <CountdownOverlay count={countdown} />}

          {/* Error Display */}
          {error && <ErrorOverlay message={error.message} />}
        </>
      )}
    </div>
  );
}
