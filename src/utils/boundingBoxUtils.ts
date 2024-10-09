import { mapBoxToRenderedVideo } from "./mapping";

export interface MappedBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function processBoundingBox(
  box: any, // Replace with actual type
  video: HTMLVideoElement,
  videoRect: DOMRect,
  flipped: boolean,
  setBoundingBox: (box: MappedBox) => void,
  isDebugMode: boolean,
  ctx: CanvasRenderingContext2D | null,
): { relativePosition: { x: number; y: number } } {
  const mappedBox = mapBoxToRenderedVideo(box, video, videoRect, flipped);
  setBoundingBox(mappedBox);

  if (isDebugMode && ctx) {
    drawBoundingBox(ctx, mappedBox);
  }

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

  return { relativePosition };
}

function drawBoundingBox(
  ctx: CanvasRenderingContext2D,
  box: { x: number; y: number; width: number; height: number },
) {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(box.x, box.y, box.width, box.height);
}
