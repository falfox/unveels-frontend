import { useEffect, useState } from "react";
import {
  ObjectDetector,
  FilesetResolver,
  ObjectDetectorResult,
} from "@mediapipe/tasks-vision";
import { result } from "lodash";

interface FindTheLookCanvasProps {
  image: HTMLImageElement;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function FindTheLookCanvas({
  image,
  canvasRef,
}: FindTheLookCanvasProps) {
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

  const [earringDetector, setEarringDetector] = useState<ObjectDetector | null>(null);
  const [earringResult, setEarringResult] = useState<ObjectDetectorResult | null>(
    null,
  );

  const [glassDetector, setGlassDetector] = useState<ObjectDetector | null>(null);
  const [glassResult, setGlassResult] = useState<ObjectDetectorResult | null>(
    null,
  );

  const [headDetector, setHeadDetector] = useState<ObjectDetector | null>(null);
  const [headResult, setHeadResult] = useState<ObjectDetectorResult | null>(
    null,
  );

  const [makeupDetector, setMakeupDetector] = useState<ObjectDetector | null>(null);
  const [makeupResult, setMakeupResult] = useState<ObjectDetectorResult | null>(
    null,
  );


  
  // Initialize the model
  useEffect(() => {
    let isMounted = true;

    const InitializeHandDetector = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
        );

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
            scoreThreshold: 0.8,
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
    };
  }, []);

  // Run detection
  useEffect(() => {
    const detectHands = async () => {
      if (handDetector && ringDetector && neckDetector && earringDetector && glassDetector && headDetector&& makeupDetector) {
        const resultsHand = await handDetector.detect(image);
        const resultsRing = await ringDetector?.detect(image);
        const resultsNeck = await neckDetector.detect(image);
        const resultsEarring = await earringDetector?.detect(image);
        const resultsGlass = await glassDetector?.detect(image);
        const resultsHead = await headDetector.detect(image);
        const resultsMakeup = await makeupDetector?.detect(image);
        setHandResult(resultsHand);
        setringResult(resultsRing);
        setNeckResult(resultsNeck);
        setEarringResult(resultsEarring);
        setGlassResult(resultsGlass);
        setHeadResult(resultsHead);
        setMakeupResult(resultsMakeup);

        console.log("Hand Result: ", resultsHand);
        console.log("Ring Result: ", resultsRing);
        console.log("Neck Result: ", resultsNeck);
        console.log("Earring Result: ", resultsEarring);
        console.log("Glass Result: ", resultsGlass);
        console.log("Head Result: ", resultsHead);
        console.log("Makeup Result: ", resultsMakeup);
      }
    };

    detectHands();
  }, [handDetector, ringDetector,neckDetector,earringDetector,glassDetector,headDetector,makeupDetector]);

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

      makeupResult.detections.forEach((result) => {
        const { boundingBox, categories } = result;
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
    };

    drawImage();
    window.addEventListener("resize", drawImage);

    return () => {
      window.removeEventListener("resize", drawImage);
    };
  }, [image, canvasRef, handResult, ringResult,neckResult,earringResult,glassResult,headResult,makeupResult]);

  return null;
}
