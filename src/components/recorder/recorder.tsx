import clsx from "clsx";
import { Lightbulb, Scan, ScanFace } from "lucide-react";
import { useEffect, useState } from "react";
import { useCamera } from "./recorder-context";

const categorizedHints = {
  facePosition: [
    "Keep the face centered within the frame.",
    "Position the face at the center of the screen for best results.",
    "Aim the camera straight at the face.",
  ],
  lighting: [
    "Ensure it is a well-lit area with natural or bright artificial light.",
    "Ensure the light source is in front of the face, not behind.",
  ],
  orientation: [
    "Hold the head upright and avoid tilting the face.",
    "Maintain a straight gaze without looking up or down.",
  ],
};

function RecorderGuide() {
  const {
    criterias: { facePosition, lighting, orientation },
  } = useCamera();

  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [filteredHints, setFilteredHints] = useState<string[]>([]);

  // Function to filter hints based on unmet criteria
  const getFilteredHints = () => {
    const hintsToShow: string[] = [];

    if (!facePosition) {
      hintsToShow.push(...categorizedHints.facePosition);
    }

    if (!lighting) {
      hintsToShow.push(...categorizedHints.lighting);
    }

    if (!orientation) {
      hintsToShow.push(...categorizedHints.orientation);
    }

    return hintsToShow;
  };

  // Update filtered hints whenever criteria change
  useEffect(() => {
    const newFilteredHints = getFilteredHints();
    setFilteredHints(newFilteredHints);
    setCurrentHintIndex(0); // Reset hint index when hints change
  }, [facePosition, lighting, orientation]);

  // Cycle through hints at a set interval (e.g., every 5 seconds)
  useEffect(() => {
    if (filteredHints.length === 0) return; // No hints to show

    const interval = setInterval(() => {
      setCurrentHintIndex(
        (prevIndex) => (prevIndex + 1) % filteredHints.length,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [filteredHints]);

  // If no hints to show, display a default message or nothing
  if (filteredHints.length === 0) {
    return null; // Or you can return a message like <p>All criteria met!</p>
  }

  return (
    <div className="select-none px-2 pb-4 text-center text-white">
      <p className="pb-9">{filteredHints[currentHintIndex]}</p>

      <div className="grid grid-cols-3 gap-5 text-xs text-white/50">
        <div
          className={clsx(
            "flex items-center justify-between rounded-lg border px-2.5 py-2",
            facePosition
              ? "border-white text-white [background:linear-gradient(90deg,_#CA9C43_0%,_#916E2B_27.4%,_#6A4F1B_59.4%,_#473209_100%);]"
              : "border-dashed border-white/50",
          )}
        >
          Face Position
          <ScanFace className="size-6" />
        </div>
        <div
          className={clsx(
            "flex items-center justify-between rounded-lg border px-2.5 py-2",
            lighting
              ? "border-white text-white [background:linear-gradient(90deg,_#CA9C43_0%,_#916E2B_27.4%,_#6A4F1B_59.4%,_#473209_100%);]"
              : "border-dashed border-white/50",
          )}
        >
          Lighting
          <Lightbulb className="size-6" />
        </div>
        <div
          className={clsx(
            "flex items-center justify-between rounded-lg border px-2.5 py-2",
            orientation
              ? "border-white text-white [background:linear-gradient(90deg,_#CA9C43_0%,_#916E2B_27.4%,_#6A4F1B_59.4%,_#473209_100%);]"
              : "border-dashed border-white/50",
          )}
        >
          Orientation
          <Scan className="size-6" />
        </div>
      </div>
    </div>
  );
}

export function VideoScene() {
  return <RecorderGuide />;
}
