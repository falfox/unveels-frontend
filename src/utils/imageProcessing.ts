/**
 * Calculates the average brightness of the video frame.
 */
export const calculateLighting = async (
  video: HTMLVideoElement,
): Promise<number> => {
  const offscreenCanvas = document.createElement("canvas");
  const ctx = offscreenCanvas.getContext("2d");
  if (!ctx) return 0;

  const width = 160; // Reduced resolution for performance
  const height = 120;
  offscreenCanvas.width = width;
  offscreenCanvas.height = height;

  ctx.drawImage(video, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let total = 0;
  const numPixels = width * height;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    total += luminance;
  }

  return total / numPixels;
};

/**
 * Crops the captured image based on the bounding box.
 */
export const cropImage = (
  imageSrc: string,
  box: { x: number; y: number; width: number; height: number },
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = box.width;
      canvas.height = box.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Cannot get canvas context"));
        return;
      }
      ctx.drawImage(
        img,
        box.x,
        box.y,
        box.width,
        box.height,
        0,
        0,
        box.width,
        box.height,
      );
      const croppedImageSrc = canvas.toDataURL("image/jpeg");
      resolve(croppedImageSrc);
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = imageSrc;
  });
};

/**
 * Fungsi untuk mengkonversi string base64 menjadi objek Image
 * @param {string} base64Str - String base64 gambar
 * @returns {Promise<HTMLImageElement>} - Promise yang menghasilkan objek Image
 */
export const base64ToImage = async (
  base64Str: string,
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `${base64Str}`;
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error("Gagal memuat gambar."));
  });
};

// Function to compute Convex Hull using Andrew's Monotone Chain algorithm
export function computeConvexHull(points: [number, number][]) {
  points.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
  const cross = (
    o: [number, number],
    a: [number, number],
    b: [number, number],
  ) => {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  };

  const lower: [number, number][] = [];
  for (let point of points) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0
    ) {
      lower.pop();
    }
    lower.push(point);
  }

  const upper: [number, number][] = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i];
    while (
      upper.length >= 2 &&
      cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0
    ) {
      upper.pop();
    }
    upper.push(point);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
}
