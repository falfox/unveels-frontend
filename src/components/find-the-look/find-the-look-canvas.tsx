import { useEffect, useRef, useState } from "react";
import {
  ObjectDetector,
  FilesetResolver,
  ObjectDetectorResult,
  FaceLandmarker,
} from "@mediapipe/tasks-vision";
import { FindTheLookItems } from "../../types/findTheLookItems";
import { Landmark } from "../../types/landmark";
import { extractSkinColor } from "../../utils/imageProcessing";
import { useFindTheLookContext } from "./find-the-look-context";

interface FindTheLookCanvasProps {
  image: HTMLImageElement;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isFlip?: boolean; // New prop added
  onLabelClick?: (label: string | null, section: string | null) => void;
}

interface Hitbox {
  label: string;
  section: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function FindTheLookCanvas({
  image,
  canvasRef,
  isFlip = false, // Default to true if not provided
  onLabelClick,
}: FindTheLookCanvasProps) {
  const { selectedItems: cart } = useFindTheLookContext();
  const results: FindTheLookItems[] = [];

  const hitboxesRef = useRef<Hitbox[]>([]);

  // State variables for detectors and results
  const [handDetector, setHandDetector] = useState<ObjectDetector | null>(null);
  const [handResult, setHandResult] = useState<ObjectDetectorResult | null>(
    null,
  );
  const [ringDetector, setRingDetector] = useState<ObjectDetector | null>(null);
  const [ringResult, setRingResult] = useState<ObjectDetectorResult | null>(
    null,
  );
  const [neckDetector, setNeckDetector] = useState<ObjectDetector | null>(null);
  const [neckResult, setNeckResult] = useState<ObjectDetectorResult | null>(
    null,
  );
  const [earringDetector, setEarringDetector] = useState<ObjectDetector | null>(
    null,
  );
  const [earringResult, setEarringResult] =
    useState<ObjectDetectorResult | null>(null);
  const [glassDetector, setGlassDetector] = useState<ObjectDetector | null>(
    null,
  );
  const [glassResult, setGlassResult] = useState<ObjectDetectorResult | null>(
    null,
  );
  const [headDetector, setHeadDetector] = useState<ObjectDetector | null>(null);
  const [headResult, setHeadResult] = useState<ObjectDetectorResult | null>(
    null,
  );
  const [makeupDetector, setMakeupDetector] = useState<ObjectDetector | null>(
    null,
  );
  const [makeupResult, setMakeupResult] = useState<ObjectDetectorResult | null>(
    null,
  );

  // FaceLandmarker for facial landmarks
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(
    null,
  );
  const [faceLandmark, setFaceLandmark] = useState<Landmark[] | null>(null);

  // Initialize the models
  useEffect(() => {
    let isMounted = true;

    const initializeDetectors = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
        );

        // Initialize FaceLandmarker
        const faceLandmarkConfiguration =
          await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU",
            },
            runningMode: "IMAGE",
            numFaces: 1,
            minFaceDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
            minFacePresenceConfidence: 0.5,
          });

        // Initialize Hand Detector
        const handConfiguration = await ObjectDetector.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: "/models/find-the-look/hand.tflite",
              delegate: "GPU",
            },
            runningMode: "IMAGE",
            maxResults: 2,
            scoreThreshold: 0.63,
          },
        );

        // Initialize Ring Detector
        const ringConfiguration = await ObjectDetector.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: "/models/find-the-look/rings.tflite",
              delegate: "GPU",
            },
            runningMode: "IMAGE",
            maxResults: 1,
            scoreThreshold: 0.2,
          },
        );

        // Initialize Neck Detector
        const neckConfiguration = await ObjectDetector.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: "/models/find-the-look/neck.tflite",
              delegate: "GPU",
            },
            runningMode: "IMAGE",
            maxResults: 1,
            scoreThreshold: 0.7,
          },
        );

        // Initialize Earring Detector
        const earringConfiguration = await ObjectDetector.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: "/models/find-the-look/earrings.tflite",
              delegate: "GPU",
            },
            runningMode: "IMAGE",
            maxResults: 1,
            scoreThreshold: 0.8,
          },
        );

        // Initialize Glass Detector
        const glassConfiguration = await ObjectDetector.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: "/models/find-the-look/glass.tflite",
              delegate: "GPU",
            },
            runningMode: "IMAGE",
            maxResults: 1,
            scoreThreshold: 0.6,
          },
        );

        // Initialize Head Detector
        const headConfiguration = await ObjectDetector.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: "/models/find-the-look/head.tflite",
              delegate: "GPU",
            },
            runningMode: "IMAGE",
            maxResults: 1,
            scoreThreshold: 0.63,
          },
        );

        // Initialize Makeup Detector
        const makeupConfiguration = await ObjectDetector.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: "/models/find-the-look/makeup.tflite",
              delegate: "GPU",
            },
            runningMode: "IMAGE",
            maxResults: 4,
            scoreThreshold: 0.1,
          },
        );

        if (isMounted) {
          setFaceLandmarker(faceLandmarkConfiguration);
          setHandDetector(handConfiguration);
          setRingDetector(ringConfiguration);
          setNeckDetector(neckConfiguration);
          setEarringDetector(earringConfiguration);
          setGlassDetector(glassConfiguration);
          setHeadDetector(headConfiguration);
          setMakeupDetector(makeupConfiguration);
        }
      } catch (error) {
        console.error("Failed to initialize detectors: ", error);
      }
    };

    initializeDetectors();

    return () => {
      isMounted = false;
      // Close all detectors
      if (handDetector) {
        handDetector.close();
      }
      if (ringDetector) {
        ringDetector.close();
      }
      if (neckDetector) {
        neckDetector.close();
      }
      if (earringDetector) {
        earringDetector.close();
      }
      if (glassDetector) {
        glassDetector.close();
      }
      if (headDetector) {
        headDetector.close();
      }
      if (makeupDetector) {
        makeupDetector.close();
      }
      if (faceLandmarker) {
        faceLandmarker.close();
      }
    };
  }, []);

  // Run detection
  useEffect(() => {
    const detectObjects = async () => {
      if (
        handDetector &&
        ringDetector &&
        neckDetector &&
        earringDetector &&
        glassDetector &&
        headDetector &&
        makeupDetector &&
        faceLandmarker
      ) {
        try {
          const resultsHand = await handDetector.detect(image);
          const resultsRing = await ringDetector.detect(image);
          const resultsNeck = await neckDetector.detect(image);
          const resultsEarring = await earringDetector.detect(image);
          const resultsGlass = await glassDetector.detect(image);
          const resultsHead = await headDetector.detect(image);
          const resultsMakeup = await makeupDetector.detect(image);
          const resultsFaceLandmark = await faceLandmarker.detect(image);

          setHandResult(resultsHand);
          setRingResult(resultsRing);
          setNeckResult(resultsNeck);
          setEarringResult(resultsEarring);
          setGlassResult(resultsGlass);
          setHeadResult(resultsHead);
          setMakeupResult(resultsMakeup);
          setFaceLandmark(resultsFaceLandmark.faceLandmarks[0] || null);
        } catch (error) {
          console.error("Error during detection: ", error);
        }
      }
    };

    detectObjects();
  }, [
    handDetector,
    ringDetector,
    neckDetector,
    earringDetector,
    glassDetector,
    headDetector,
    makeupDetector,
    faceLandmarker,
    image,
  ]);

  // Draw detections on canvas
  useEffect(() => {
    if (
      !handResult ||
      !ringResult ||
      !neckResult ||
      !earringResult ||
      !glassResult ||
      !headResult ||
      !makeupResult
    )
      return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context for overlay canvas.");
      return;
    }

    const drawImage = () => {
      const { innerWidth: width, innerHeight: height } = window;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const imgAspect = image.naturalWidth / image.naturalHeight;
      const canvasAspect = width / height;

      let drawWidth, drawHeight, offsetX, offsetY, scaleX, scaleY;

      if (imgAspect < canvasAspect) {
        drawWidth = width;
        drawHeight = width / imgAspect;
        offsetX = 0;
        offsetY = (height - drawHeight) / 2;
        scaleX = drawWidth / image.naturalWidth;
        scaleY = drawHeight / image.naturalHeight;
      } else {
        drawWidth = height * imgAspect;
        drawHeight = height;
        offsetX = (width - drawWidth) / 2;
        offsetY = 0;
        scaleX = drawWidth / image.naturalWidth;
        scaleY = drawHeight / image.naturalHeight;
      }

      ctx.clearRect(0, 0, width, height);

      if (isFlip) {
        // Apply horizontal flip
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
          image,
          -offsetX - drawWidth,
          offsetY,
          drawWidth,
          drawHeight,
        );
        ctx.restore();
      } else {
        // Draw image normally
        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
      }

      // Reset hitboxes for each draw
      hitboxesRef.current = [];

      // Function to calculate the centerX based on isFlip
      const calculateCenterX = (bboxOriginX: number, bboxWidth: number) => {
        if (isFlip) {
          return (
            width - (bboxOriginX * scaleX + offsetX + (bboxWidth * scaleX) / 2)
          );
        }
        return bboxOriginX * scaleX + offsetX + (bboxWidth * scaleX) / 2;
      };

      // Function to calculate labelX based on isFlip
      const calculateLabelX = (centerX: number) => {
        return isFlip ? centerX - 50 : centerX + 50;
      };

      // Common function to draw detections
      const drawDetections = (
        detections: ObjectDetectorResult,
        section: string,
      ) => {
        detections.detections.forEach((det) => {
          const { boundingBox, categories } = det;
          if (!boundingBox) return;

          const centerX = calculateCenterX(
            boundingBox.originX,
            boundingBox.width,
          );
          const centerY =
            boundingBox.originY * scaleY +
            offsetY +
            (boundingBox.height * scaleY) / 2;

          // Draw the landmark circle at the center
          ctx.beginPath();
          ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
          ctx.fillStyle = "white"; // Red color
          ctx.fill();
          ctx.closePath();

          // Calculate label position
          const labelX = calculateLabelX(centerX);
          const labelY = centerY + 50;

          // Draw a line from the center to the label
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(labelX, labelY);
          ctx.strokeStyle = "white";
          ctx.stroke();

          // Display the label
          if (categories && categories.length > 0) {
            const label = categories[0].categoryName;
            ctx.font = "12px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(label, labelX, labelY - 5);

            // Draw underline for label text
            const textWidth = ctx.measureText(label).width;
            const underlineEndX = labelX + textWidth;
            const underlineY = labelY + 5;

            ctx.beginPath();
            ctx.moveTo(labelX, labelY);
            ctx.lineTo(underlineEndX, underlineY);
            ctx.strokeStyle = "white";
            ctx.stroke();

            hitboxesRef.current.push({
              label: label,
              section: section,
              x: labelX,
              y: labelY - 20,
              width: textWidth,
              height: 20,
            });
          }
        });
      };

      // Draw each detection type
      drawDetections(handResult, "accessories");
      drawDetections(ringResult, "accessories");
      drawDetections(neckResult, "accessories");
      drawDetections(earringResult, "accessories");
      drawDetections(glassResult, "accessories");
      drawDetections(headResult, "accessories");

      // Handle Makeup Detections Separately
      makeupResult.detections.forEach((result) => {
        const { categories } = result;

        categories.forEach((category) => {
          let drawX: number, drawY: number, label: string;

          // Define specific landmarks for each makeup category
          if (
            category.categoryName === "Lipstick" &&
            faceLandmark &&
            faceLandmark[407]
          ) {
            drawX = isFlip
              ? width -
                (faceLandmark[407].x * image.naturalWidth * scaleX + offsetX)
              : faceLandmark[407].x * image.naturalWidth * scaleX + offsetX;
            drawY =
              faceLandmark[407].y * image.naturalHeight * scaleY + offsetY;
            label = "Lipstick";

            const averageLipColor = extractSkinColor(
              image,
              faceLandmark,
              [
                14, 15, 16, 17, 87, 86, 85, 84, 317, 316, 315, 314, 178, 179,
                180, 317, 316, 315,
              ],
              2,
            );

            results.push({
              label: category.displayName,
              color: averageLipColor.hexColor,
            });

            // Draw landmark point
            ctx.beginPath();
            ctx.arc(drawX, drawY, 10, 0, 2 * Math.PI);
            ctx.fillStyle = "white)"; // Red color
            ctx.fill();
            ctx.closePath();

            // Calculate label position
            const labelX = calculateLabelX(drawX);
            const labelY = drawY + 50;

            // Draw a line from the center to the label
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(labelX, labelY);
            ctx.strokeStyle = "white";
            ctx.stroke();

            // Display the label
            ctx.font = "12px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(label, labelX, labelY - 5);

            // Draw underline for label text
            const textWidth = ctx.measureText(label).width;
            const underlineEndX = labelX + textWidth;
            const underlineY = labelY + 5;

            ctx.beginPath();
            ctx.moveTo(labelX, labelY);
            ctx.lineTo(underlineEndX, underlineY);
            ctx.strokeStyle = "white";
            ctx.stroke();

            hitboxesRef.current.push({
              label: label,
              section: "makeup",
              x: labelX,
              y: labelY - 20,
              width: textWidth,
              height: 20,
            });
          }

          if (
            category.categoryName === "Eyebrow" &&
            faceLandmark &&
            faceLandmark[225]
          ) {
            drawX = isFlip
              ? width -
                (faceLandmark[225].x * image.naturalWidth * scaleX + offsetX)
              : faceLandmark[225].x * image.naturalWidth * scaleX + offsetX;
            drawY =
              faceLandmark[225].y * image.naturalHeight * scaleY + offsetY;
            label = "Eyebrow";

            const averageEyebrowsColor = extractSkinColor(
              image,
              faceLandmark,
              [70, 63, 105, 66, 46, 53, 52, 65, 296, 334, 293, 295, 282, 283],
              2,
            );

            results.push({
              label: category.displayName,
              color: averageEyebrowsColor.hexColor,
            });

            // Draw landmark point
            ctx.beginPath();
            ctx.arc(drawX, drawY, 10, 0, 2 * Math.PI);
            ctx.fillStyle = "white"; // Red color
            ctx.fill();
            ctx.closePath();

            // Calculate label position
            const labelX = calculateLabelX(drawX);
            const labelY = drawY + 50;

            // Draw a line from the center to the label
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(labelX, labelY);
            ctx.strokeStyle = "white";
            ctx.stroke();

            // Display the label
            ctx.font = "12px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(label, labelX, labelY - 5);

            // Draw underline for label text
            const textWidth = ctx.measureText(label).width;
            const underlineEndX = labelX + textWidth;
            const underlineY = labelY + 5;

            ctx.beginPath();
            ctx.moveTo(labelX, labelY);
            ctx.lineTo(underlineEndX, underlineY);
            ctx.strokeStyle = "white";
            ctx.stroke();

            hitboxesRef.current.push({
              label: label,
              section: "makeup",
              x: labelX,
              y: labelY - 20,
              width: textWidth,
              height: 20,
            });
          }

          if (
            category.categoryName === "Blusher" &&
            faceLandmark &&
            faceLandmark[280]
          ) {
            drawX = isFlip
              ? width -
                (faceLandmark[280].x * image.naturalWidth * scaleX + offsetX)
              : faceLandmark[280].x * image.naturalWidth * scaleX + offsetX;
            drawY =
              faceLandmark[280].y * image.naturalHeight * scaleY + offsetY;
            label = "Blusher";

            const averageBlushColor = extractSkinColor(
              image,
              faceLandmark,
              [280, 80],
              2,
            );

            results.push({
              label: category.displayName,
              color: averageBlushColor.hexColor,
            });

            // Draw landmark point
            ctx.beginPath();
            ctx.arc(drawX, drawY, 10, 0, 2 * Math.PI);
            ctx.fillStyle = "white"; // Red color
            ctx.fill();
            ctx.closePath();

            // Calculate label position
            const labelX = calculateLabelX(drawX);
            const labelY = drawY + 50;

            // Draw a line from the center to the label
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(labelX, labelY);
            ctx.strokeStyle = "white";
            ctx.stroke();

            // Display the label
            ctx.font = "12px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(label, labelX, labelY - 5);

            // Draw underline for label text
            const textWidth = ctx.measureText(label).width;
            const underlineEndX = labelX + textWidth;
            const underlineY = labelY + 5;

            ctx.beginPath();
            ctx.moveTo(labelX, labelY);
            ctx.lineTo(underlineEndX, underlineY);
            ctx.strokeStyle = "white";
            ctx.stroke();

            hitboxesRef.current.push({
              label: label,
              section: "makeup",
              x: labelX,
              y: labelY - 20,
              width: textWidth,
              height: 20,
            });
          }

          if (
            category.categoryName === "Eyeshadow" &&
            faceLandmark &&
            faceLandmark[257]
          ) {
            drawX = isFlip
              ? width -
                (faceLandmark[257].x * image.naturalWidth * scaleX + offsetX)
              : faceLandmark[257].x * image.naturalWidth * scaleX + offsetX;
            drawY =
              faceLandmark[257].y * image.naturalHeight * scaleY + offsetY;
            label = "Eyeshadow";

            const averageEyeshadowColor = extractSkinColor(
              image,
              faceLandmark,
              [29, 27],
              2,
            );

            results.push({
              label: category.displayName,
              color: averageEyeshadowColor.hexColor,
            });

            // Draw landmark point
            ctx.beginPath();
            ctx.arc(drawX, drawY, 10, 0, 2 * Math.PI);
            ctx.fillStyle = "white"; // Red color
            ctx.fill();
            ctx.closePath();

            // Calculate label position
            const labelX = calculateLabelX(drawX);
            const labelY = drawY + 50;

            // Draw a line from the center to the label
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(labelX, labelY);
            ctx.strokeStyle = "white";
            ctx.stroke();

            // Display the label
            ctx.font = "12px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(label, labelX, labelY - 5);

            // Draw underline for label text
            const textWidth = ctx.measureText(label).width;
            const underlineEndX = labelX + textWidth;
            const underlineY = labelY + 5;

            ctx.beginPath();
            ctx.moveTo(labelX, labelY);
            ctx.lineTo(underlineEndX, underlineY);
            ctx.strokeStyle = "white";
            ctx.stroke();

            hitboxesRef.current.push({
              label: label,
              section: "makeup",
              x: labelX,
              y: labelY - 20,
              width: textWidth,
              height: 20,
            });
          }
        });
      });

      // Optionally, handle other detection types or additional drawing here
    };

    drawImage();
    window.addEventListener("resize", drawImage);

    return () => {
      window.removeEventListener("resize", drawImage);
    };
  }, [
    image,
    canvasRef,
    handResult,
    ringResult,
    neckResult,
    earringResult,
    glassResult,
    headResult,
    makeupResult,
    faceLandmark,
    isFlip, // Add isFlip as a dependency
  ]);

  // Handle click events on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas tidak ditemukan untuk menambahkan event listener.");
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = ((event.clientX - rect.left) * scaleX) / dpr;
      const y = ((event.clientY - rect.top) * scaleY) / dpr;

      let labelClicked: string | null = null;
      let sectionClicked: string | null = null;

      for (const bbox of hitboxesRef.current) {
        if (
          x >= bbox.x &&
          x <= bbox.x + bbox.width &&
          y >= bbox.y &&
          y <= bbox.y + bbox.height
        ) {
          labelClicked = bbox.label;
          sectionClicked = bbox.section; // Capture the section as well
          break;
        }
      }

      if (onLabelClick) {
        onLabelClick(labelClicked, sectionClicked); // Pass both label and section
      }
    };

    canvas.addEventListener("click", handleClick);
    console.log("Event listener untuk klik telah ditambahkan.");

    return () => {
      canvas.removeEventListener("click", handleClick);
      console.log("Event listener untuk klik telah dihapus.");
    };
  }, [onLabelClick]);

  return null;
}
