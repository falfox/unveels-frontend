import {
  createGraphRunner,
  GraphRunner,
  WasmModule,
} from "./mediapipe/web/graph_runner/graph_runner";
import {
  createMediaPipeAudioBlendshapes,
  MediaPipeAudioBlendshapes,
} from "./mediapipe-audio-blendshapes";

const messageTag = document.getElementById("message") as HTMLCanvasElement;
const fpsRenderer = {
  process(mspf: number) {
    let detectionString = "";
    if (mspf && mspf > 0.0) {
      detectionString += `  Processing: ${mspf.toFixed(2)} ms`;
    }
    messageTag.textContent = detectionString;
  },
};

declare interface TalkingHeadsWasmModule {
  NUM_QUEUED_AUDIO_PACKETS: number;
}

let wasmModule: TalkingHeadsWasmModule;
let wasmLib: GraphRunner;

// Deklarasi audioBlendshapes agar tersedia di seluruh file
let audioBlendshapes: MediaPipeAudioBlendshapes | null = null;

// Variabel untuk menyimpan durasi audio
let audioDuration = 0;

function renderLoop() {
  const start = performance.now();
  wasmLib.finishProcessing();
  fpsRenderer.process(performance.now() - start);
  requestAnimationFrame(() => {
    renderLoop();
  });
}

// Fungsi untuk mengambil blendshape setiap 1/60 detik secara sinkron
async function syncBlendshapeLoop(
  audioBlendshapes: MediaPipeAudioBlendshapes,
  audioDuration: number,
): Promise<Array<{ time: number; blendshapes: any }>> {
  const interval = 1 / 60; // Interval tetap 0.016666 detik (1/60 detik)
  const blendshapeData: Array<{ time: number; blendshapes: any }> = [];
  let frameIndex = 0;

  while (frameIndex * interval < audioDuration) {
    const currentTime = frameIndex * interval; // Hitung timestamp dengan interval tetap

    // Tunggu sampai blendshape tersedia
    const blendshapes = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(audioBlendshapes.getBlendshapes());
      }, interval * 1000); // Menunggu 1/60 detik sebelum mengambil blendshape
    });

    // Simpan blendshape dengan timestamp tetap
    blendshapeData.push({ time: currentTime, blendshapes });

    frameIndex++; // Tambah indeks frame
  }

  console.log("Proses selesai, audio telah habis.");

  // Kembalikan semua data blendshape yang terkumpul setelah proses selesai
  return blendshapeData;
}

const NUM_SAMPLES = 32; // Sangat kecil, untuk memproses lebih sedikit data per batch
const SAMPLE_RATE = 3000; // Sample rate lebih tinggi dari 2000, namun masih rendah dan didukung oleh AudioContext

async function loadAndStreamAudioFromUrl(
  wasmLib: GraphRunner | MediaPipeAudioBlendshapes,
  audioUrl: string,
) {
  // Membuat AudioContext dengan sample rate yang valid
  const audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const audioData = audioBuffer.getChannelData(0);

  // Tentukan durasi audio dalam detik
  audioDuration = audioBuffer.duration;

  let lastAudioTimestamp = 0.0;
  for (let i = 0; i < audioData.length; i += NUM_SAMPLES) {
    const chunk = audioData.slice(i, i + NUM_SAMPLES);
    const timestamp = lastAudioTimestamp + (NUM_SAMPLES * 1000.0) / SAMPLE_RATE;

    if (timestamp > lastAudioTimestamp) {
      wasmLib.addAudioToStream(
        new Float32Array(chunk),
        "input_audio",
        timestamp,
      );
    }
    lastAudioTimestamp = timestamp;
  }
}

export async function runBlendshapesDemo(
  isV2: boolean,
  audioUrl: string,
): Promise<Array<{ time: number; blendshapes: any }>> {
  // Inisialisasi ulang audioBlendshapes setiap kali fungsi dipanggil
  audioBlendshapes = await createMediaPipeAudioBlendshapes(
    isV2
      ? "talking_head_v2/talking_heads_v2_blendshapes_internal.js"
      : "talking_head_v1/talking_heads_blendshapes_internal.js",
    isV2
      ? "talking_head_v2/talking_heads_v2_microphone_assets.js"
      : "talking_head_v1/talking_heads_microphone_assets.js",
  );

  // Inisialisasi ulang wasmModule
  wasmModule = audioBlendshapes.wasmModule as WasmModule &
    TalkingHeadsWasmModule;
  wasmModule.NUM_QUEUED_AUDIO_PACKETS = 0;

  audioBlendshapes.configureAudio(1, NUM_SAMPLES, SAMPLE_RATE);

  await audioBlendshapes.initializeGraph(
    isV2
      ? "talking_head_v2/talking_heads_v2_demo.binarypb"
      : "talking_head_v1/talking_heads_demo.binarypb",
  );

  // Mulai aliran audio dan tunggu hingga selesai sebelum memulai loop sinkron
  await loadAndStreamAudioFromUrl(audioBlendshapes, audioUrl);

  // Mulai loop sinkron untuk mengambil data blendshape setiap 1/60 detik
  const blendshapeResult = await syncBlendshapeLoop(
    audioBlendshapes,
    audioDuration,
  );

  // Kembalikan hasil akhir blendshape setelah audio selesai diproses
  return blendshapeResult;
}

export let lastAudioT = 0.0;
export let isThinking = false;
export let isLookingLeft = false;

export function setIsThinking(isT: boolean) {
  if (isT === isThinking) return;
  isThinking = isT;
  if (isThinking) {
    isLookingLeft = !isLookingLeft;
  }
}

export function registerCallback(audioData: Float32Array) {
  if (audioBlendshapes === null) return;
  wasmModule.NUM_QUEUED_AUDIO_PACKETS++;
  const timestamp = lastAudioT + (NUM_SAMPLES * 1000.0) / SAMPLE_RATE;
  if (timestamp > lastAudioT) {
    audioBlendshapes.addAudioToStream(audioData, "input_audio", timestamp);
  }
  lastAudioT = timestamp;
}

export default {
  runBlendshapesDemo,
  registerCallback,
  audioBlendshapes,
  lastAudioT,
};
