import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VoiceButton from "../assistant/voice-button";

const VoiceCommand = () => {
  const [recording, setRecording] = useState(false);
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState("");

  // Check if Web Speech API is supported
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false; // Hanya mendengarkan satu perintah
    recognition.lang = "en-GB"; // Mengatur bahasa Inggris UK
    recognition.interimResults = false;

    // Event handler ketika hasil pengenalan suara tersedia
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      console.log("Transcript:", speechResult);
      setTranscript(speechResult); // Update transcript state
      handleCommand(speechResult); // Handle command setelah mendengarkan
      setRecording(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setRecording(false);
    };
  } else {
    console.error("Web Speech API not supported in this browser.");
  }

  const startListening = () => {
    if (recognition) {
      setTranscript(""); // Reset transcript
      recognition.start(); // Mulai mendengarkan
      setRecording(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop(); // Berhenti mendengarkan
      setRecording(false);
    }
  };

  // Function to handle both navigation and scroll commands
  const handleCommand = (transcript) => {
    handleNavigationCommand(transcript);
    handleScrollCommand(transcript);
  };

  const handleNavigationCommand = (transcript) => {
    const navigateCommandPattern = /navigate to (.+)/i;
    const match = transcript.match(navigateCommandPattern);

    if (match) {
      const route = match[1].toLowerCase().trim();
      console.log(`Navigating to: ${route}`);

      switch (route) {
        case "skin tone finder":
          navigate("/skin-tone-finder");
          break;
        case "personality finder":
          navigate("/personality-finder");
          break;
        case "face analyzer":
          navigate("/face-analyzer");
          break;
        default:
          console.log("Route not recognized");
      }
    }
  };

  const handleScrollCommand = (transcript) => {
    if (/go (to )?bottom|scroll to bottom/i.test(transcript)) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      console.log("Scrolling to bottom");
    } else if (/go (to )?top|scroll to top/i.test(transcript)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      console.log("Scrolling to top");
    } else if (/go (to )?half|scroll to half/i.test(transcript)) {
      window.scrollTo({
        top: document.body.scrollHeight / 2,
        behavior: "smooth",
      });
      console.log("Scrolling to half");
    } else if (/scroll (up|down)/i.test(transcript)) {
      const direction = transcript.includes("down") ? 1 : -1;
      window.scrollBy({ top: direction * 100, behavior: "smooth" });
      console.log(`Scrolling ${direction === 1 ? "down" : "up"} by 100px`);
    } else {
      const scrollByMatch = transcript.match(
        /scroll (by|to) (\d+)(px|pixel|%|percent)?/i,
      );
      if (scrollByMatch) {
        const [, , value, unit] = scrollByMatch;
        let scrollValue = parseInt(value);

        if (unit && (unit.includes("%") || unit.includes("percent"))) {
          scrollValue = (scrollValue / 100) * document.body.scrollHeight;
        }

        if (transcript.includes("scroll by")) {
          window.scrollBy({ top: scrollValue, behavior: "smooth" });
          console.log(`Scrolling by ${scrollValue}px`);
        } else if (transcript.includes("scroll to")) {
          window.scrollTo({ top: scrollValue, behavior: "smooth" });
          console.log(`Scrolling to ${scrollValue}px`);
        }
      }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[10000]">
      <VoiceButton
        recording={recording}
        setRecording={setRecording}
        startListening={startListening}
        stopListening={stopListening}
      />
    </div>
  );
};

export default VoiceCommand;
