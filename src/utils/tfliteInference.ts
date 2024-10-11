// src/utils/tfliteInference.ts
import "@tensorflow/tfjs-backend-cpu";
import * as tf from "@tensorflow/tfjs-core";
import * as tflite from "@tensorflow/tfjs-tflite";

let tfliteModel: tflite.TFLiteModel | null = null;

/**
 * Loads the TensorFlow Lite model.
 * @param modelUrl URL or path to the TFLite .tflite file
 */
export const loadTFLiteModel = async (modelUrl: string): Promise<void> => {
  console.log(modelUrl);
  try {
    tflite.setWasmPath(
      "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.10/wasm/",
    );

    tfliteModel = await tflite.loadTFLiteModel(modelUrl);
    console.log("TFLite Model loaded successfully");
  } catch (error) {
    console.error("Error loading TFLite model:", error);
    throw error;
  }
};

/**
 * Preprocesses the image for TFLite model inference.
 * @param imageData Base64 string of the image
 * @returns Preprocessed Float32Array
 */
export const preprocessTFLiteImage = async (
  imageData: string,
  w: number,
  h: number,
): Promise<Float32Array> => {
  const img = new Image();
  img.src = imageData;
  await img.decode(); // Wait for the image to load

  const canvas = document.createElement("canvas");
  canvas.width = w; // Adjust size as per model
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to get canvas context");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Convert image data to Float32Array (RGB)
  const input = new Float32Array((imageDataObj.data.length / 4) * 3);
  for (let i = 0; i < imageDataObj.data.length; i += 4) {
    input[(i / 4) * 3] = imageDataObj.data[i] / 255; // R
    input[(i / 4) * 3 + 1] = imageDataObj.data[i + 1] / 255; // G
    input[(i / 4) * 3 + 2] = imageDataObj.data[i + 2] / 255; // B
  }

  return input;
};

/**
 * Performs inference using the loaded TFLite model.
 * @param preprocessedImage Preprocessed Float32Array
 * @returns Inference results as Float32Array
 */
export const runTFLiteInference = async (
  preprocessedImage: Float32Array,
  w: number,
  h: number,
): Promise<Tensor> => {
  if (!tfliteModel) {
    throw new Error("TFLite model is not loaded");
  }

  try {
    // Create Tensor from Float32Array
    const inputTensor = tf.tensor(preprocessedImage, [1, w, h, 3]);

    // Perform inference
    const outputTensor = await tfliteModel.predict(inputTensor);

    return outputTensor;

    throw new Error("Unexpected output type from TFLite model");
  } catch (error) {
    console.error("Error during TFLite inference:", error);
    throw error;
  }
};
