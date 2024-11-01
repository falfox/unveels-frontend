import { useWavesurfer } from "@wavesurfer/react";
import { PauseCircle, PlayCircle } from "lucide-react";
import { useCallback, useRef } from "react";

const AudioWave = ({ url }: { url: string }) => {
  const containerRef = useRef(null);

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    height: 48,
    waveColor: "rgb(255, 255, 255)",
    progressColor: "#CA9C43",
    url,

    // Set a bar width
    barWidth: 2,
    // Optionally, specify the spacing between bars
    barGap: 1,
    // And the bar radius
    barRadius: 2,
    cursorWidth: 0,
  });

  const onPlayPause = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  return (
    <div className="flex w-full items-center space-x-1">
      <button type="button" onClick={onPlayPause}>
        {isPlaying ? (
          <PauseCircle className="size-6" />
        ) : (
          <PlayCircle className="size-6" />
        )}
      </button>
      <div ref={containerRef} className="w-32 lg:w-96" />
    </div>
  );
};

export default AudioWave;
