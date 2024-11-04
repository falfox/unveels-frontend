import { useEffect, useState } from "react";
import {
  ObjectDetector,
  FilesetResolver,
  ObjectDetectorResult,
  FaceLandmarker,
  FaceDetector,
} from "@mediapipe/tasks-vision";
import { result } from "lodash";
import { useFindTheLook } from "../../context/find-the-look-context";
import { FindTheLookItems } from "../../types/findTheLookItems";
import { Landmark } from "../../types/landmark";
import { extractSkinColor } from "../../utils/imageProcessing";

interface FindTheLookCanvasProps {
  image: HTMLImageElement;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function FindTheLookCanvas({
  image,
  canvasRef,
}: FindTheLookCanvasProps) {
  const { setFindTheLookItems } = useFindTheLook();
  const results: FindTheLookItems[] = [];

  const [handDetector, setHandDetector] = useState<ObjectDetector | null>(null);
  const [handResult, setHandResult] = useState<ObjectDetectorResult | null>(
    null,
  );
  const [ringDetector, setRingDetector] = useState<ObjectDetector | null>(null);
  const [ringResult, setringResult] = useState<ObjectDetectorResult | null>(
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

  // facelandmark
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(
    null,
  );
  const [faceLandmark, setFaceLandmark] = useState<Landmark[] | null>(null);

  // Initialize the model
  useEffect(() => {
    let isMounted = true;

    const InitializeHandDetector = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
        );

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

        const makeupConfiguration = await ObjectDetector.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath: "/models/find-the-look/makeup.tflite",
              delegate: "GPU",
            },
            runningMode: "IMAGE",
            maxResults: 1,
            scoreThreshold: 0.1,
          },
        );

        if (isMounted) {
          setHandDetector(handConfiguration);
          setRingDetector(ringConfiguration);
          setNeckDetector(neckConfiguration);
          setEarringDetector(earringConfiguration);
          setGlassDetector(glassConfiguration);
          setHeadDetector(headConfiguration);
          setMakeupDetector(makeupConfiguration);
          setFaceLandmarker(faceLandmarkConfiguration);
        }
      } catch (error) {
        console.error("Failed to initialize Hand Detector: ", error);
      }
    };

    InitializeHandDetector();

    return () => {
      isMounted = false;
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
    const detectHands = async () => {
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
        const resultsHand = await handDetector.detect(image);
        const resultsRing = await ringDetector?.detect(image);
        const resultsNeck = await neckDetector.detect(image);
        const resultsEarring = await earringDetector?.detect(image);
        const resultsGlass = await glassDetector?.detect(image);
        const resultsHead = await headDetector.detect(image);
        const resultsMakeup = await makeupDetector?.detect(image);
        const resultsFaceLandmark = await faceLandmarker.detect(image);
        setHandResult(resultsHand);
        setringResult(resultsRing);
        setNeckResult(resultsNeck);
        setEarringResult(resultsEarring);
        setGlassResult(resultsGlass);
        setHeadResult(resultsHead);
        setMakeupResult(resultsMakeup);
        setFaceLandmark(resultsFaceLandmark.faceLandmarks[0]);

        console.log("Hand Result: ", resultsHand);
        console.log("Ring Result: ", resultsRing);
        console.log("Neck Result: ", resultsNeck);
        console.log("Earring Result: ", resultsEarring);
        console.log("Glass Result: ", resultsGlass);
        console.log("Head Result: ", resultsHead);
        console.log("Makeup Result: ", resultsMakeup);
        console.log("Landmark Result: ", faceLandmark);
      }
    };

    detectHands();
  }, [
    handDetector,
    ringDetector,
    neckDetector,
    earringDetector,
    glassDetector,
    headDetector,
    makeupDetector,
    faceLandmarker,
  ]);

  useEffect(() => {
    if (!handResult) return;
    if (!ringResult) return;
    if (!neckResult) return;
    if (!earringResult) return;
    if (!glassResult) return;
    if (!headResult) return;
    if (!makeupResult) return;

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

      // Flip horizontally only for the image
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

      // Draw bounding boxes and labels
      const outerRadius = 10;

      handResult.detections.forEach((result) => {
        const { boundingBox, categories } = result;
        results.push({
          label: result.categories[0].displayName,
        });
        if (boundingBox) {
          // Calculate the center of the bounding box
          const centerX =
            width -
            (boundingBox.originX * scaleX +
              offsetX +
              (boundingBox.width * scaleX) / 2);
          const centerY =
            boundingBox.originY * scaleY +
            offsetY +
            (boundingBox.height * scaleY) / 2;

          // Draw the landmark circle at the center
          ctx.beginPath();
          ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
          ctx.fillStyle = "rgba(255, 0, 0, 0.8)"; // Red color
          ctx.fill();
          ctx.closePath();

          // Calculate label position
          const labelX = centerX + 50;
          const labelY = centerY + 50;

          // Draw a line from the center of the bounding box to the label position
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
          }
        }
      });

      ringResult.detections.forEach((result) => {
        const { boundingBox, categories } = result;
        results.push({
          label: result.categories[0].displayName,
        });
        if (boundingBox) {
          // Calculate the center of the bounding box
          const centerX =
            width -
            (boundingBox.originX * scaleX +
              offsetX +
              (boundingBox.width * scaleX) / 2);
          const centerY =
            boundingBox.originY * scaleY +
            offsetY +
            (boundingBox.height * scaleY) / 2;

          // Draw the landmark circle at the center
          ctx.beginPath();
          ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
          ctx.fillStyle = "rgba(255, 0, 0, 0.8)"; // Red color
          ctx.fill();
          ctx.closePath();

          // Calculate label position
          const labelX = centerX + 50;
          const labelY = centerY + 50;

          // Draw a line from the center of the bounding box to the label position
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
          }
        }
      });

      neckResult.detections.forEach((result) => {
        const { boundingBox, categories } = result;
        results.push({
          label: result.categories[0].displayName,
        });
        if (boundingBox) {
          // Calculate the center of the bounding box
          const centerX =
            width -
            (boundingBox.originX * scaleX +
              offsetX +
              (boundingBox.width * scaleX) / 2);
          const centerY =
            boundingBox.originY * scaleY +
            offsetY +
            (boundingBox.height * scaleY) / 2;

          // Draw the landmark circle at the center
          ctx.beginPath();
          ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
          ctx.fillStyle = "rgba(255, 0, 0, 0.8)"; // Red color
          ctx.fill();
          ctx.closePath();

          // Calculate label position
          const labelX = centerX + 50;
          const labelY = centerY + 50;

          // Draw a line from the center of the bounding box to the label position
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
          }
        }
      });

      earringResult.detections.forEach((result) => {
        const { boundingBox, categories } = result;
        results.push({
          label: result.categories[0].displayName,
        });
        if (boundingBox) {
          // Calculate the center of the bounding box
          const centerX =
            width -
            (boundingBox.originX * scaleX +
              offsetX +
              (boundingBox.width * scaleX) / 2);
          const centerY =
            boundingBox.originY * scaleY +
            offsetY +
            (boundingBox.height * scaleY) / 2;

          // Draw the landmark circle at the center
          ctx.beginPath();
          ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
          ctx.fillStyle = "rgba(255, 0, 0, 0.8)"; // Red color
          ctx.fill();
          ctx.closePath();

          // Calculate label position
          const labelX = centerX + 50;
          const labelY = centerY + 50;

          // Draw a line from the center of the bounding box to the label position
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
          }
        }
      });

      glassResult.detections.forEach((result) => {
        const { boundingBox, categories } = result;
        results.push({
          label: result.categories[0].displayName,
        });
        if (boundingBox) {
          // Calculate the center of the bounding box
          const centerX =
            width -
            (boundingBox.originX * scaleX +
              offsetX +
              (boundingBox.width * scaleX) / 2);
          const centerY =
            boundingBox.originY * scaleY +
            offsetY +
            (boundingBox.height * scaleY) / 2;

          // Draw the landmark circle at the center
          ctx.beginPath();
          ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
          ctx.fillStyle = "rgba(255, 0, 0, 0.8)"; // Red color
          ctx.fill();
          ctx.closePath();

          // Calculate label position
          const labelX = centerX + 50;
          const labelY = centerY + 50;

          // Draw a line from the center of the bounding box to the label position
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
          }
        }
      });

      headResult.detections.forEach((result) => {
        const { boundingBox, categories } = result;
        results.push({
          label: result.categories[0].displayName,
        });
        if (boundingBox) {
          // Calculate the center of the bounding box
          const centerX =
            width -
            (boundingBox.originX * scaleX +
              offsetX +
              (boundingBox.width * scaleX) / 2);
          const centerY =
            boundingBox.originY * scaleY +
            offsetY +
            (boundingBox.height * scaleY) / 2;

          // Draw the landmark circle at the center
          ctx.beginPath();
          ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
          ctx.fillStyle = "rgba(255, 0, 0, 0.8)"; // Red color
          ctx.fill();
          ctx.closePath();

          // Calculate label position
          const labelX = centerX + 50;
          const labelY = centerY + 50;

          // Draw a line from the center of the bounding box to the label position
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
          }
        }
      });

      const eyebrowIndices = [
        70, 63, 105, 66, 46, 53, 52, 65, 296, 334, 293, 295, 282, 283,
      ];
      const lipIndices = [
        14, 15, 16, 17, 87, 86, 85, 84, 317, 316, 315, 314, 178, 179, 180, 317,
        316, 315,
      ];

      const blushIndices = [280, 80];

      const eyeshadowIndices = [29, 27];

      makeupResult.detections.forEach((result) => {
        const { categories } = result;

        categories.forEach((category) => {
          let drawXLips,
            drawYLips,
            labelLips,
            drawXEyebrow,
            drawYEyebrow,
            labelEyebrow,
            drawXBlusher,
            drawYBlusher,
            labelBlusher,
            drawXEyeshadow,
            drawYEyeshadow,
            labelEyeshadow;

          // Define specific landmarks for each makeup category
          if (
            category.categoryName === "Lipstick" &&
            faceLandmark &&
            faceLandmark[407]
          ) {
            drawXLips =
              faceLandmark[407].x * image.naturalWidth * scaleX + offsetX;
            drawYLips =
              faceLandmark[407].y * image.naturalHeight * scaleY + offsetY;
            labelLips = "lipstick";

            const averageLipColor = extractSkinColor(
              image,
              faceLandmark,
              lipIndices,
              2,
            );

            results.push({
              label: result.categories[0].displayName,
              color: averageLipColor.hexColor,
            });

            // Draw landmark point
            const outerRadiusLips = 10;
            ctx.beginPath();
            ctx.arc(drawXLips, drawYLips, outerRadius, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(255, 0, 0, 0.8)"; // Red color
            ctx.fill();
            ctx.closePath();

            // Draw label with line
            const labelXLips = drawXLips + 50;
            const labelYLips = drawYLips + 50;

            // Draw a line from the center of the bounding box to the label position
            ctx.beginPath();
            ctx.moveTo(drawXLips, drawYLips);
            ctx.lineTo(labelXLips, labelYLips);
            ctx.strokeStyle = "white";
            ctx.stroke();

            // Display the label
            ctx.font = "12px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(labelLips, labelXLips, labelYLips - 5);

            // Draw underline for label text
            const textWidth = ctx.measureText(labelLips).width;
            const underlineEndX = labelXLips + textWidth;
            const underlineY = labelYLips + 5;

            ctx.beginPath();
            ctx.moveTo(labelXLips, labelYLips);
            ctx.lineTo(underlineEndX, underlineY);
            ctx.strokeStyle = "white";
            ctx.stroke();
          } else if (
            category.categoryName === "Eyebrown" &&
            faceLandmark &&
            faceLandmark[225]
          ) {
            drawXEyebrow =
              faceLandmark[225].x * image.naturalWidth * scaleX + offsetX;
            drawYEyebrow =
              faceLandmark[225].y * image.naturalHeight * scaleY + offsetY;

            const averageEyebrowsColor = extractSkinColor(
              image,
              faceLandmark,
              eyebrowIndices,
              2,
            );

            labelEyebrow = "eyebrows";

            results.push({
              label: result.categories[0].displayName,
              color: averageEyebrowsColor.hexColor,
            });
          } else if (
            category.categoryName === "Blusher" &&
            faceLandmark &&
            faceLandmark[280]
          ) {
            drawXBlusher =
              faceLandmark[280].x * image.naturalWidth * scaleX + offsetX;
            drawYBlusher =
              faceLandmark[280].y * image.naturalHeight * scaleY + offsetY;

            const averageBlushColor = extractSkinColor(
              image,
              faceLandmark,
              blushIndices,
              2,
            );

            labelBlusher = "blushes ";

            results.push({
              label: result.categories[0].displayName,
              color: averageBlushColor.hexColor,
            });
          } else if (
            category.categoryName === "Eyeshadow" &&
            faceLandmark &&
            faceLandmark[257]
          ) {
            drawXEyeshadow =
              faceLandmark[257].x * image.naturalWidth * scaleX + offsetX;
            drawYEyeshadow =
              faceLandmark[257].y * image.naturalHeight * scaleY + offsetY;

            const averageEyeshadowColor = extractSkinColor(
              image,
              faceLandmark,
              eyeshadowIndices,
              2,
            );

            labelEyeshadow = "Eyeshadows";

            results.push({
              label: result.categories[0].displayName,
              color: averageEyeshadowColor.hexColor,
            });
          }
        });
      });
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
  ]);

  return null;
}
