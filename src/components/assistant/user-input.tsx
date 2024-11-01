import { useWavesurfer } from "@wavesurfer/react";
import clsx from "clsx";
import { CirclePlay, Mic, PauseCircle, Send, Trash } from "lucide-react";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
import { updateProgress } from "../../utils/updateProgress";

interface UserInputProps {
  msg: string;
  setMsg: (value: string) => void;
  onSendMessage: (message: string) => void;
}

const UserInput = ({ msg, setMsg, onSendMessage }: UserInputProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [recordingState, setRecordingState] = useState<
    "idle" | "recording" | "paused"
  >("idle");

  const [progressMs, setProgressMs] = useState(0);

  const plugins = useMemo(
    () => [
      RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: false,
      }),
    ],
    [],
  );
  const { wavesurfer } = useWavesurfer({
    container: containerRef,
    height: 48,
    waveColor: "rgb(255, 255, 255)",
    progressColor: "#CA9C43",

    // Set a bar width
    barWidth: 2,
    // Optionally, specify the spacing between bars
    barGap: 1,
    // And the bar radius
    barRadius: 2,
    cursorWidth: 0,
  });

  const record = plugins[0];

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.registerPlugin(record);
      record.on("record-end", (blob) => {
        console.log("Recording ended", blob);
        setRecordingState("idle");
        setProgressMs(0);
      });

      record.on("record-start", () => {
        console.log("Recording started");
        setRecordingState("recording");
      });

      record.on("record-pause", (blob) => {
        console.log("Recording paused", blob);
        setRecordingState("paused");
      });

      record.on("record-resume", () => {
        console.log("Recording resumed");
        setRecordingState("recording");
      });

      record.on("record-progress", (time) => {
        console.log("Recording progress", time);

        setProgressMs(time);
      });

      return () => {
        record.destroy();
      };
    }
  }, [wavesurfer, record]);

  return (
    <>
      <div className="relative mr-3 flex w-full justify-between p-px">
        <div
          className="pointer-events-none absolute inset-0 rounded-full border border-transparent"
          style={
            {
              background: `linear-gradient(90deg, #CA9C43 0%, #916E2B 27.4%, #6A4F1B 59.4%, #473209 100%)`,
              "-webkit-mask": `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
              mask: `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
              "-webkit-mask-composite": "destination-out",
              "mask-composite": "exclude",
            } as CSSProperties
          }
        />
        {recordingState !== "idle" ? (
          <div className="mx-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                record.stopRecording();
              }}
            >
              <Trash className="size-6 text-white" />
            </button>

            <span className="text-white">{updateProgress(progressMs)}</span>
          </div>
        ) : null}
        <input
          className={clsx(
            "w-full rounded-full bg-black px-3 py-4 text-white placeholder-gray-400",
            { invisible: recordingState !== "idle" },
          )}
          placeholder="Ask me anything..."
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSendMessage(msg);
            }
          }}
        />

        <div
          className={clsx(
            "pointer-events-none absolute inset-0 flex items-center justify-center rounded-full pl-20 pr-14",
            {
              invisible: recordingState === "idle",
            },
          )}
        >
          <div ref={containerRef} className="w-48 px-4 lg:w-64" />
        </div>

        <div className="absolute inset-y-0 right-0 flex h-full w-12 items-center justify-center">
          <button
            type="button"
            onClick={() => {
              if (recordingState === "idle") {
                record.startRecording();
              } else if (recordingState === "recording") {
                record.pauseRecording();
              } else {
                record.resumeRecording();
              }
            }}
          >
            {recordingState === "idle" ? (
              <Mic className="size-6 text-gray-400" />
            ) : recordingState === "recording" ? (
              <PauseCircle className="size-6 text-red-600" />
            ) : (
              <CirclePlay className="size-6 text-white" />
            )}
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onSendMessage(msg)}
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)]"
      >
        <Send className="h-6 w-6 text-white" />
      </button>
    </>
  );
};

export default UserInput;
