// video-stream.tsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import { useCamera } from "./recorder-context";

const BRIGHTNESS_THRESHOLD = 60; // Kecerahan > 60
const POSITION_THRESHOLD_X = 50; // Posisi X dalam ±50 piksel dari pusat
const POSITION_THRESHOLD_Y = 50; // Posisi Y dalam ±50 piksel dari pusat
const ORIENTATION_THRESHOLD_YAW = 10; // Yaw antara -10° dan +10°
const ORIENTATION_THRESHOLD_PITCH = 10; // Pitch antara -10° dan +10°

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export function VideoStream() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<Error | null>(null);
  const faceDetectorRef = useRef<FaceDetector | null>(null);
  const isDetectingRef = useRef<boolean>(false);

  // Menggunakan CameraContext
  const { criterias, setCriterias, flipCamera } = useCamera();

  // State Variables for Metrics
  const [lighting, setLighting] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [orientation, setOrientation] = useState<{
    yaw: number;
    pitch: number;
  }>({
    yaw: 0,
    pitch: 0,
  });

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
                  // Map the bounding box to the rendered video
                  const mappedBox = mapBoxToRenderedVideo(
                    box,
                    video,
                    videoRect,
                    criterias.flipped,
                  );

                  // Draw the bounding box
                  ctx.strokeStyle = "red";
                  ctx.lineWidth = 2;
                  ctx.strokeRect(
                    mappedBox.x,
                    mappedBox.y,
                    mappedBox.width,
                    mappedBox.height,
                  );

                  // Hitung posisi relatif wajah
                  const faceCenter = {
                    x: mappedBox.x + mappedBox.width / 2,
                    y: mappedBox.y + mappedBox.height / 2,
                  };
                  const frameCenter = {
                    x: videoRect.width / 2,
                    y: videoRect.height / 2,
                  };
                  const relativePosition = {
                    x: faceCenter.x - frameCenter.x,
                    y: faceCenter.y - frameCenter.y,
                  };
                  setPosition(relativePosition);
                }

                // Gambar keypoints
                keypoints.forEach((keypoint, index) => {
                  const mappedPoint = mapPointToRenderedVideo(
                    keypoint,
                    video,
                    videoRect,
                    criterias.flipped,
                  );

                  // Pastikan keypoint berada dalam batas canvas
                  if (
                    mappedPoint.x >= 0 &&
                    mappedPoint.x <= canvas.width &&
                    mappedPoint.y >= 0 &&
                    mappedPoint.y <= canvas.height
                  ) {
                    ctx.fillStyle = "blue"; // Ubah warna untuk visibilitas
                    ctx.beginPath();
                    ctx.arc(mappedPoint.x, mappedPoint.y, 4, 0, 2 * Math.PI);
                    ctx.fill();
                  } else {
                    console.warn(
                      `Keypoint ${index} is out of bounds:`,
                      mappedPoint,
                    );
                  }
                });

                // Hitung Orientasi
                if (keypoints.length >= 6) {
                  // **Pastikan indeks keypoint sesuai dengan dokumentasi MediaPipe**
                  const leftEye = keypoints[0];
                  const rightEye = keypoints[1];
                  const nose = keypoints[2];
                  const leftMouth = keypoints[3];
                  const rightMouth = keypoints[4];

                  // Hitung yaw dan pitch berdasarkan posisi mata dan hidung
                  const dx = rightEye.x - leftEye.x;
                  const dy = rightEye.y - leftEye.y;
                  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                  // Estimasi pitch sederhana berdasarkan posisi hidung relatif ke mata
                  const noseY = nose.y;
                  const eyesY = (leftEye.y + rightEye.y) / 2;
                  const pitchAngle = (eyesY - noseY) * 0.1; // Faktor skala

                  setOrientation({
                    yaw: angle,
                    pitch: pitchAngle,
                  });
                }
              }

              // Hitung Kecerahan
              calculateLighting(video).then((avgBrightness) => {
                setLighting(avgBrightness);
              });
            } catch (err) {
              console.error("Detection error:", err);
            }
          }
        }
      }

      if (isDetectingRef.current) {
        requestAnimationFrame(detect);
      }
    };

    detect();
  }, [criterias.flipped]);

  // Function to stop detection
  const stopDetection = () => {
    isDetectingRef.current = false;
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  // Function to toggle camera (flip)
  const toggleFacingMode = () => {
    flipCamera();
  };

  // Handle responsive resizing menggunakan ResizeObserver
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

    // Update ukuran awal
    updateCanvasSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  /**
   * Helper function to map bounding box coordinates dari video asli ke video yang dirender
   */
  const mapBoxToRenderedVideo = (
    box: {
      originX: number;
      originY: number;
      width: number;
      height: number;
    },
    video: HTMLVideoElement,
    videoRect: DOMRect,
    flipped: boolean,
  ) => {
    let { originX, originY, width, height } = box;

    // Dimensi video asli
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Dimensi video yang dirender
    const renderedWidth = videoRect.width;
    const renderedHeight = videoRect.height;

    // Hitung faktor skala dan cropping berdasarkan object-fit: cover
    const scale = Math.max(
      renderedWidth / videoWidth,
      renderedHeight / videoHeight,
    );
    const scaledWidth = videoWidth * scale;
    const scaledHeight = videoHeight * scale;

    const cropX = (scaledWidth - renderedWidth) / 2;
    const cropY = (scaledHeight - renderedHeight) / 2;

    // Skala dan terjemahkan bounding box
    let x = originX * scale - cropX - 80;
    let y = originY * scale - cropY - 120;
    let boxWidth = width * scale * 1.2;
    let boxHeight = height * scale * 1.2;

    // Tangani mirroring
    if (flipped) {
      x = renderedWidth - (x + boxWidth);
    }

    return { x, y, width: boxWidth, height: boxHeight };
  };

  /**
   * Helper function to map keypoint coordinates dari video asli ke video yang dirender
   */
  const mapPointToRenderedVideo = (
    keypoint: { x: number; y: number },
    video: HTMLVideoElement,
    videoRect: DOMRect,
    flipped: boolean,
  ) => {
    let { x, y } = keypoint;

    // Jika keypoints dalam koordinat normal, skala ke dimensi video asli
    x *= video.videoWidth;
    y *= video.videoHeight;

    // Dimensi video asli
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Dimensi video yang dirender
    const renderedWidth = videoRect.width;
    const renderedHeight = videoRect.height;

    // Hitung faktor skala dan cropping berdasarkan object-fit: cover
    const scale = Math.max(
      renderedWidth / videoWidth,
      renderedHeight / videoHeight,
    );
    const scaledWidth = videoWidth * scale;
    const scaledHeight = videoHeight * scale;

    const cropX = (scaledWidth - renderedWidth) / 2;
    const cropY = (scaledHeight - renderedHeight) / 2;

    // Skala dan terjemahkan keypoint
    let mappedX = x * scale - cropX;
    let mappedY = y * scale - cropY;

    // Tangani mirroring
    if (flipped) {
      mappedX = renderedWidth - mappedX;
    }

    return { x: mappedX, y: mappedY };
  };

  /**
   * Helper Function to Calculate Average Brightness (Lighting)
   */
  const calculateLighting = async (
    video: HTMLVideoElement,
  ): Promise<number> => {
    const offscreenCanvas = document.createElement("canvas");
    const ctx = offscreenCanvas.getContext("2d");
    if (!ctx) return 0;

    // Set canvas dimensions
    const width = 160; // Kurangi resolusi untuk performa
    const height = 120;
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;

    // Gambar frame video ke offscreen canvas
    ctx.drawImage(video, 0, 0, width, height);

    // Dapatkan data piksel
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Hitung rata-rata kecerahan
    let total = 0;
    const numPixels = width * height;
    for (let i = 0; i < data.length; i += 4) {
      // Menggunakan rumus luminansi
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      total += luminance;
    }

    const avgBrightness = total / numPixels;
    return avgBrightness;
  };

  /**
   * Evaluates whether the current metrics meet the defined criteria.
   * Memperbarui CameraContext dengan hasil evaluasi kriteria
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
  }, [lighting, position, orientation, setCriterias]);

  // Menggunakan useEffect untuk memanggil evaluateCriteria setiap kali metrics berubah
  useEffect(() => {
    evaluateCriteria();
  }, [evaluateCriteria]);

  return (
    <div className="relative h-full w-full">
      {/* Webcam Video */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        mirrored={false} // Mirroring ditangani via CSS
        videoConstraints={{
          ...videoConstraints,
          facingMode: criterias.flipped ? "environment" : "user", // Gunakan flipped untuk menentukan facingMode
        }}
        onUserMediaError={(error) => {
          if (error instanceof Error) {
            setError(error);
          }
        }}
        className={`h-full w-full object-cover ${
          criterias.flipped ? "scale-x-[-1]" : ""
        }`}
      />

      {/* Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute left-0 top-0"
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* Error Display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <p className="text-lg text-white">{error.message}</p>
        </div>
      )}

      {/* Toggle Camera Button */}
      <button
        onClick={toggleFacingMode}
        className="absolute bottom-4 right-4 rounded bg-blue-500 p-3 text-white shadow-lg transition duration-300 hover:bg-blue-600"
      >
        Flip Camera
      </button>
    </div>
  );
}
