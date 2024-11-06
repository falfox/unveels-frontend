import { useWavesurfer } from "@wavesurfer/react";
import clsx from "clsx";
import { CirclePlay, Mic, PauseCircle, Send, Trash } from "lucide-react";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
import { updateProgress } from "../../utils/updateProgress";

interface UserInputProps {
  msg: string;
  setMsg: (value: string) => void;
  onSendMessage: (message: string, audioURL?: string | null) => void;
}

const UserInput = ({ msg, setMsg, onSendMessage }: UserInputProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [recordingState, setRecordingState] = useState<
    "idle" | "recording" | "paused"
  >("idle");
  const [progressMs, setProgressMs] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isSendDisabled, setIsSendDisabled] = useState(false);
  const transcriptRef = useRef<string>("");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

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
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    cursorWidth: 0,
    plugins,
  });

  const record = plugins[0];

  const startProgressTimer = () => {
    timerRef.current = window.setInterval(() => {
      setProgressMs((prev) => prev + 100); // Update progress every 100ms
    }, 100);
  };

  const stopProgressTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.registerPlugin(record);

      record.on("record-start", () => {
        setRecordingState("recording");
        transcriptRef.current = "";
        setAudioURL(null);
        startProgressTimer(); // Start progress timer
      });

      record.on("record-pause", () => {
        setRecordingState("paused");
        stopProgressTimer(); // Stop progress timer
      });

      record.on("record-resume", () => {
        setRecordingState("recording");
        startProgressTimer(); // Resume progress timer
      });

      record.on("record-end", (blob) => {
        const generatedAudioURL = URL.createObjectURL(blob);
        setAudioURL(generatedAudioURL);
        setRecordingState("idle");
        stopProgressTimer(); // Stop timer when recording ends
        setProgressMs(0); // Reset progress after recording ends
        setVoiceTranscript(transcriptRef.current.trim());

        if (isSending) {
          onSendMessage(transcriptRef.current.trim(), generatedAudioURL);
          transcriptRef.current = "";
          setIsSending(false);
        }

        setIsSendDisabled(false);
      });

      return () => {
        record.destroy();
        record.unAll();
        stopProgressTimer();
      };
    }
  }, [wavesurfer, record, isSending, onSendMessage]);

  const handleTrashClick = () => {
    setAudioURL(null);
    setVoiceTranscript("");
    transcriptRef.current = "";
    setRecordingState("idle");
    setProgressMs(0); // Reset progress on trash
    setIsSendDisabled(false);
    stopProgressTimer(); // Stop timer on trash

    if (wavesurfer && record) {
      record.destroy();
      const newRecord = RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: false,
      });
      wavesurfer.registerPlugin(newRecord);
    }
  };

  const handleSendMessage = () => {
    if (recordingState === "recording" || recordingState === "paused") {
      setIsSending(true);
      setIsSendDisabled(true);
      record.stopRecording();
    } else {
      onSendMessage(msg, null);
      setMsg("");
    }
    setRecordingState("idle");
  };

  const handleMicrophoneClick = () => {
    if (recordingState === "idle") {
      record.startRecording();
      setIsSendDisabled(true);
    } else if (recordingState === "recording") {
      record.pauseRecording();
      setIsSendDisabled(false);
    } else {
      record.resumeRecording();
      setIsSendDisabled(true);
    }
  };

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
            <button type="button" onClick={handleTrashClick}>
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
          value={recordingState === "idle" ? msg : voiceTranscript}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isSendDisabled) {
              handleSendMessage();
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
          <button type="button" onClick={handleMicrophoneClick}>
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
        onClick={handleSendMessage}
        disabled={isSendDisabled}
        className={clsx(
          "flex size-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(90deg,#CA9C43_0%,#916E2B_27.4%,#6A4F1B_59.4%,#473209_100%)]",
          { "cursor-not-allowed opacity-50": isSendDisabled },
        )}
      >
        <Send className="h-6 w-6 text-white" />
      </button>
    </>
  );
};

export default UserInput;
