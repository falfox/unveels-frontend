// src/workers/scannerWorker.ts

// Interface untuk pesan yang diterima dari main thread
interface WorkerMessage {
  imageData: ImageBitmap;
  width: number;
  height: number;
  canvas: OffscreenCanvas;
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { imageData, width, height, canvas } = event.data;

  if (!(canvas instanceof OffscreenCanvas)) {
    console.error("Canvas yang diterima bukan OffscreenCanvas.");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Gagal mendapatkan konteks 2D untuk OffscreenCanvas.");
    return;
  }

  // Gambar gambar awal
  ctx.drawImage(imageData, 0, 0, width, height);

  let scanPosition = 0;
  const scanSpeed = 5; // Kecepatan gerakan scanner (pixels per frame)

  const animateScanner = () => {
    ctx.clearRect(0, 0, width, height);

    // Gambar ImageBitmap ke OffscreenCanvas
    ctx.drawImage(imageData, 0, 0, width, height);

    // Gambar scanner
    ctx.fillStyle = "rgba(0, 255, 0, 0.6)";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(0, 255, 0, 1)";
    ctx.fillRect(0, scanPosition, width, 15);

    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    ctx.fillStyle = "white";
    ctx.fillRect(0, scanPosition + 3, width, 9);

    scanPosition += scanSpeed;

    if (scanPosition >= height - 15) {
      // Scan mencapai bawah, reset ke atas
      scanPosition = 0;
    }

    // Minta frame berikutnya
    self.requestAnimationFrame(animateScanner);
  };

  // Mulai animasi
  animateScanner();
};
