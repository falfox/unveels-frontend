import {
  loadTFLiteModel,
  preprocessTFLiteImage,
  runTFLiteInference,
} from "../utils/tfliteInference";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import {
  thickNessLabels,
  cheeksbonesLabels,
  eyeLidLabels,
  eyeangleLabels,
  eyebrowDistanceLabels,
  eyebrowShapeLabels,
  eyedistanceLabels,
  eyeshapeLabels,
  eyesizeLabels,
  faceShapeLabels,
  noseLengthLabels,
  lipLabels,
  noseWidthLabels,
  personalityLabels,
  thinnessLabels,
  shortnessLabels,
} from "../utils/constants";
import { Classifier } from "../types/classifier";

const classifiers: Classifier[] = [
  {
    name: "Cheeks Bones",
    outputName: "StatefulPartitionedCall_1:0",
    labels: cheeksbonesLabels,
    outputLabel: "",
  },
  {
    name: "Eye Angle",
    outputName: "StatefulPartitionedCall_1:1",
    labels: eyeangleLabels,
    outputLabel: "",
  },
  {
    name: "Eye Distance",
    outputName: "StatefulPartitionedCall_1:2",
    labels: eyedistanceLabels,
    outputLabel: "",
  },
  {
    name: "Eye Shape",
    outputName: "StatefulPartitionedCall_1:3",
    labels: eyeshapeLabels,
    outputLabel: "",
  },
  {
    name: "Eye Size",
    outputName: "StatefulPartitionedCall_1:4",
    labels: eyesizeLabels,
    outputLabel: "",
  },
  {
    name: "Eyebrow Distance",
    outputName: "StatefulPartitionedCall_1:5",
    labels: eyebrowDistanceLabels,
    outputLabel: "",
  },
  {
    name: "Eye Lid",
    outputName: "StatefulPartitionedCall_1:6",
    labels: eyeLidLabels,
    outputLabel: "",
  },
  {
    name: "Lip",
    outputName: "StatefulPartitionedCall_1:7",
    labels: lipLabels,
    outputLabel: "",
  },
  {
    name: "Nose Length",
    outputName: "StatefulPartitionedCall_1:8",
    labels: noseLengthLabels,
    outputLabel: "",
  },
  {
    name: "Nose Width",
    outputName: "StatefulPartitionedCall_1:9",
    labels: noseWidthLabels,
    outputLabel: "",
  },
  {
    name: "Shortness",
    outputName: "StatefulPartitionedCall_1:10",
    labels: shortnessLabels,
    outputLabel: "",
  },
  {
    name: "Thickness",
    outputName: "StatefulPartitionedCall_1:11",
    labels: thickNessLabels,
    outputLabel: "",
  },
  {
    name: "Thinness",
    outputName: "StatefulPartitionedCall_1:12",
    labels: thinnessLabels,
    outputLabel: "",
  },
  {
    name: "Eyebrow Shape",
    outputName: "StatefulPartitionedCall_1:13",
    labels: eyebrowShapeLabels,
    outputLabel: "",
  },
  {
    name: "Face Shape",
    outputName: "StatefulPartitionedCall_1:14",
    labels: faceShapeLabels,
    outputLabel: "",
  },
  {
    name: "Personality Finder",
    outputName: "StatefulPartitionedCall_1:0",
    labels: personalityLabels,
    outputLabel: "",
    outputScore: 0,
    outputData: [],
  },
];

const findMaxIndexFaceAanalyzer = (detect: number[]) => {
  const maxIndex = detect
    .slice(0)
    .reduce(
      (maxIdx, currVal, currIdx) =>
        currVal > detect[maxIdx] ? currIdx : maxIdx,
      0,
    );
  return maxIndex;
};

const findMaxIndex = (detect: number[]) => {
  const maxIndex = detect.reduce(
    (maxIdx, currVal, currIdx) => (currVal > detect[maxIdx] ? currIdx : maxIdx),
    0,
  );
  return maxIndex;
};

/**
 * Fungsi untuk mengkonversi string base64 menjadi objek Image
 * @param {string} base64Str - String base64 gambar
 * @returns {Promise<HTMLImageElement>} - Promise yang menghasilkan objek Image
 */
function base64ToImage(base64Str: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `${base64Str}`;
    img.crossOrigin = "anonymous"; // Penting untuk menghindari masalah CORS
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error("Gagal memuat gambar."));
  });
}

/**
 * Fungsi untuk mengonversi nilai RGB ke format hex.
 * @param r - Nilai merah (0-255)
 * @param g - Nilai hijau (0-255)
 * @param b - Nilai biru (0-255)
 * @returns {string} - Nilai warna dalam format hex, misalnya "#A1B2C3"
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Fungsi untuk mengambil rata-rata warna hex dari landmark tertentu dengan sampling circular dan weighted average
 * @param {number[]} landmarkIndices - Indeks landmark
 * @param {any} landmarks - Objek landmarks dari MediaPipe
 * @param {ImageData} imageData - Data gambar dari kanvas
 * @param {number} imageWidth - Lebar gambar
 * @param {number} imageHeight - Tinggi gambar
 * @param {number} [sampleRadius=2] - Radius sampel sekitar landmark
 * @returns {string} - Rata-rata warna dalam format hex, misalnya "#A1B2C3"
 */
function getAverageColor(
  landmarkIndices: number[],
  landmarks: any,
  imageData: ImageData,
  imageWidth: number,
  imageHeight: number,
  sampleRadius: number = 1,
): string {
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let totalWeight = 0;

  landmarkIndices.forEach((index) => {
    const landmark = landmarks[index];
    if (landmark) {
      // Konversi koordinat landmark ke piksel
      const x = Math.round(landmark.x * imageWidth);
      const y = Math.round(landmark.y * imageHeight);

      // Ambil pixel di sekitar landmark dengan sampling circular
      for (let dx = -sampleRadius; dx <= sampleRadius; dx++) {
        for (let dy = -sampleRadius; dy <= sampleRadius; dy++) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > sampleRadius) continue; // Hanya ambil pixel dalam lingkaran

          const px = x + dx;
          const py = y + dy;

          // Pastikan koordinat berada dalam batas gambar
          if (px >= 0 && px < imageWidth && py >= 0 && py < imageHeight) {
            const pixelIndex = (py * imageWidth + px) * 4; // 4 untuk RGBA
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];

            // Weight berdasarkan jarak (semakin dekat, semakin besar weight)
            const weight = (sampleRadius - distance + 1) / (sampleRadius + 1); // Normalisasi weight

            totalR += r * weight;
            totalG += g * weight;
            totalB += b * weight;
            totalWeight += weight;
          }
        }
      }
    }
  });

  if (totalWeight === 0) {
    return "#000000"; // Hitam jika tidak ada weight
  }

  const avgR = Math.round(totalR / totalWeight);
  const avgG = Math.round(totalG / totalWeight);
  const avgB = Math.round(totalB / totalWeight);

  return rgbToHex(avgR, avgG, avgB);
}

export const personalityInference = async (
  imageData: string,
  w: number,
  h: number,
): Promise<Classifier[]> => {
  // Preprocess gambar
  const preprocessedImage = await preprocessTFLiteImage(imageData, w, h);

  // face analyzer
  await loadTFLiteModel(
    `${window.location.href}models/personality-finder/face-analyzer.tflite`,
  );

  const pred = await runTFLiteInference(preprocessedImage, w, h);

  classifiers.forEach(async (classifier) => {
    const classifierTensor = pred[classifier.outputName];
    const classifierData = await classifierTensor.data();
    const label = classifier.labels[findMaxIndexFaceAanalyzer(classifierData)];
    classifier.outputLabel = label;
  });

  // personality finder
  await loadTFLiteModel(
    `${window.location.href}models/personality-finder/personality_finder.tflite`,
  );

  const predPersonality = await runTFLiteInference(preprocessedImage, w, h);
  console.log(predPersonality);

  const classifierPersonalityData = await predPersonality.data();
  const labelPersonality =
    classifiers[15].labels[findMaxIndex(classifierPersonalityData)];
  classifiers[15].outputLabel = labelPersonality;
  classifiers[15].outputData = classifierPersonalityData;
  classifiers[15].outputScore =
    classifierPersonalityData[findMaxIndex(classifierPersonalityData)];
  classifiers[15].outputIndex = findMaxIndex(classifierPersonalityData);

  // skin
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

  try {
    // Konversi base64 ke Image
    const image: HTMLImageElement = await base64ToImage(imageData);

    // Buat kanvas untuk menggambar dan mengambil data piksel
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Tidak dapat mendapatkan konteks kanvas.");
    }

    // Gambarkan gambar pada kanvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Dapatkan data piksel dari kanvas
    const imageDataCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Deteksi landmark wajah
    const results = faceLandmarker.detect(imageDataCanvas);

    if (!results || results.faceLandmarks[0].length === 0) {
      throw new Error("Tidak ada wajah yang terdeteksi.");
    }

    const landmarks = results.faceLandmarks[0];

    // Definisikan indeks landmark untuk alis dan bibir
    const eyebrowIndices = [
      70, 63, 105, 66, 46, 53, 52, 65, 296, 334, 293, 295, 282, 283,
    ];
    const lipIndices = [
      14, 15, 16, 17, 87, 86, 85, 84, 317, 316, 315, 314, 178, 179, 180, 317,
      316, 315,
    ];

    const irisIndices = [468, 473];

    const averageEyebrowColor = getAverageColor(
      eyebrowIndices,
      landmarks,
      imageDataCanvas,
      canvas.width,
      canvas.height,
    );

    const averageLipColor = getAverageColor(
      lipIndices,
      landmarks,
      imageDataCanvas,
      canvas.width,
      canvas.height,
    );

    const averageEyeColor = getAverageColor(
      irisIndices,
      landmarks,
      imageDataCanvas,
      canvas.width,
      canvas.height,
    );

    classifiers.push({
      name: "Average Eyebrow Color",
      outputName: "",
      labels: [],
      outputLabel: "",
      outputColor: averageEyebrowColor,
    });

    classifiers.push({
      name: "Average Lip Color",
      outputName: "",
      labels: [],
      outputLabel: "",
      outputColor: averageLipColor,
    });

    classifiers.push({
      name: "Average Eye Color",
      outputName: "",
      labels: [],
      outputLabel: "",
      outputColor: averageEyeColor,
    });

    console.log(classifiers);

    // Kembalikan hasil setelah semua classifier diproses, termasuk gambar landmark
    return classifiers;
  } finally {
    // Tutup FaceLandmarker jika sudah tidak diperlukan
    faceLandmarker.close();
  }
};
