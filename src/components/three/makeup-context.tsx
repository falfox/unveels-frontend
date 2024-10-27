// MakeupContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

interface MakeupContextProps {
  foundationColor: string;
  setFoundationColor: (color: string) => void;

  showFoundation: boolean;
  setShowFoundation: (show: boolean) => void;

  blushColor: string;
  setBlushColor: (color: string) => void;

  blushPattern: number;
  setBlushPattern: (pattern: number) => void;

  blushMaterial: number;
  setBlushMaterial: (material: number) => void;

  showBlush: boolean;
  setShowBlush: (show: boolean) => void;

  showConcealer: boolean;
  setShowConcealer: (show: boolean) => void;

  concealerColor: string;
  setConcealerColor: (color: string) => void;

  showHighlighter: boolean;
  setShowHighlighter: (show: boolean) => void;

  highlighterPattern: number;
  setHighlighterPattern: (pattern: number) => void;

  highlighterColor: string;
  setHighlighterColor: (color: string) => void;

  highlighterMaterial: number;
  setHighlighterMaterial: (material: number) => void;

  showContour: boolean;
  setShowContour: (show: boolean) => void;

  contourMode: "One" | "Dual";
  setContourMode: (mode: "One" | "Dual") => void;

  contourColors: string[];
  setContourColors: (colors: string[]) => void;

  contourShape: string;
  setContourShape: (shape: string) => void;

  showLipliner: boolean;
  setShowLipliner: (show: boolean) => void;

  liplinerColor: string;
  setLiplinerColor: (color: string) => void;

  liplinerPattern: number;
  setLiplinerPattern: (pattern: number) => void;

  showLipplumper: boolean;
  setShowLipplumper: (show: boolean) => void;

  lipplumperColor: string;
  setLipplumperColor: (color: string) => void;

  showLipColor: boolean;
  setShowLipColor: (show: boolean) => void;

  lipColorMode: "One" | "Dual" | "Ombre";
  setLipColorMode: (mode: "One" | "Dual" | "Ombre") => void;

  lipColors: string[];
  setLipColors: (colors: string[]) => void;

  showBronzer: boolean;
  setShowBronzer: (show: boolean) => void;

  bronzerColor: string;
  setBronzerColor: (color: string) => void;

  bronzerPattern: number;
  setBronzerPattern: (shape: number) => void;
}

const MakeupContext = createContext<MakeupContextProps | undefined>(undefined);

interface MakeupProviderProps {
  children: ReactNode;
}

export const MakeupProvider: React.FC<MakeupProviderProps> = ({ children }) => {
  const [foundationColor, setFoundationColor] = useState("");
  const [showFoundation, setShowFoundation] = useState(false); // Menambahkan state untuk visibilitas foundation

  const [blushColor, setBlushColor] = useState("#FFFF");
  const [showBlush, setShowBlush] = useState(false);
  const [blushPattern, setBlushPattern] = useState(0);
  const [blushMaterial, setBlushMaterial] = useState(0);

  const [showConcealer, setShowConcealer] = useState(false);
  const [concealerColor, setConcealerColor] = useState("#FFFF");

  const [showHighlighter, setShowHighlighter] = useState(false);
  const [highlighterPattern, setHighlighterPattern] = useState(0);
  const [highlighterColor, setHighlighterColor] = useState("#FFFF");
  const [highlighterMaterial, setHighlighterMaterial] = useState(0);

  const [showContour, setShowContour] = useState(false);
  const [contourMode, setContourMode] = useState<"One" | "Dual">("One");
  const [contourColors, setContourColors] = useState<string[]>([]);
  const [contourShape, setContourShape] = useState<string>("0");

  const [showLipliner, setShowLipliner] = useState(false);
  const [liplinerColor, setLiplinerColor] = useState("#FFFF");
  const [liplinerPattern, setLiplinerPattern] = useState(0);

  const [showLipplumper, setShowLipplumper] = useState(false);
  const [lipplumperColor, setLipplumperColor] = useState("#FFFF");

  const [showLipColor, setShowLipColor] = useState(false);
  const [lipColorMode, setLipColorMode] = useState<"One" | "Dual" | "Ombre">(
    "One",
  );
  const [lipColors, setLipColors] = useState<string[]>([]);

  const [showBronzer, setShowBronzer] = useState(false);
  const [bronzerColor, setBronzerColor] = useState("#FFFF");
  const [bronzerPattern, setBronzerPattern] = useState(0);

  return (
    <MakeupContext.Provider
      value={{
        foundationColor,
        setFoundationColor,

        showFoundation,
        setShowFoundation,

        blushColor,
        setBlushColor,

        blushPattern,
        setBlushPattern,

        blushMaterial,
        setBlushMaterial,

        showBlush,
        setShowBlush,

        showConcealer,
        setShowConcealer,

        concealerColor,
        setConcealerColor,

        showHighlighter,
        setShowHighlighter,

        highlighterPattern,
        setHighlighterPattern,

        highlighterColor,
        setHighlighterColor,

        highlighterMaterial,
        setHighlighterMaterial,

        showContour,
        setShowContour,

        contourColors,
        setContourColors,

        contourShape,
        setContourShape,

        contourMode,
        setContourMode,

        liplinerColor,
        setLiplinerColor,

        showLipliner,
        setShowLipliner,

        liplinerPattern,
        setLiplinerPattern,

        showLipplumper,
        setShowLipplumper,

        lipplumperColor,
        setLipplumperColor,

        showLipColor,
        setShowLipColor,

        lipColorMode,
        setLipColorMode,

        lipColors,
        setLipColors,

        showBronzer,
        setShowBronzer,

        bronzerColor,
        setBronzerColor,

        bronzerPattern,
        setBronzerPattern,
      }}
    >
      {children}
    </MakeupContext.Provider>
  );
};

export const useMakeup = () => {
  const context = useContext(MakeupContext);
  if (!context) {
    throw new Error("useMakeup must be used within a MakeupProvider");
  }
  return context;
};
