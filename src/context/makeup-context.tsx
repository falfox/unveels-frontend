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

  showLens: boolean;
  setShowLens: (show: boolean) => void;

  lensPattern: number;
  setLensPattern: (number: number) => void;

  showEyebrows: boolean;
  setShowEyebrows: (show: boolean) => void;

  eyebrowsPattern: number;
  setEyebrowsPattern: (pattern: number) => void;

  eyebrowsVisibility: number;
  setEyebrowsVisibility: (visibility: number) => void;

  eyebrowsColor: string;
  setEyebrowsColor: (color: string) => void;
}

const MakeupContext = createContext<MakeupContextProps | undefined>(undefined);

type MakeupSelectables =
  // Foundation
  | "foundationColor"
  | "showFoundation"
  // Blush
  | "blushColor"
  | "blushPattern"
  | "blushMaterial"
  // Concealer
  | "showBlush"
  | "showConcealer"
  | "concealerColor"
  // Highlighter
  | "showHighlighter"
  | "highlighterPattern"
  | "highlighterColor"
  | "highlighterMaterial"
  // Contour
  | "showContour"
  | "contourMode"
  | "contourColors"
  | "contourShape"
  // Lipliner
  | "showLipliner"
  | "liplinerColor"
  | "liplinerPattern"
  // Lipplumper
  | "showLipplumper"
  | "lipplumperColor"
  // Lip Color
  | "showLipColor"
  | "lipColorMode"
  | "lipColors";

interface MakeupProviderProps {
  initialValues?: Partial<Pick<MakeupContextProps, MakeupSelectables>>;
  children: ReactNode;
}

export const MakeupProvider: React.FC<MakeupProviderProps> = ({
  children,
  initialValues,
}) => {
  const [foundationColor, setFoundationColor] = useState(
    initialValues?.foundationColor ?? "",
  );
  const [showFoundation, setShowFoundation] = useState(
    initialValues?.showFoundation ?? false,
  );

  const [blushColor, setBlushColor] = useState(
    initialValues?.blushColor ?? "#FFFF",
  );
  const [showBlush, setShowBlush] = useState(initialValues?.showBlush ?? false);
  const [blushPattern, setBlushPattern] = useState(
    initialValues?.blushPattern ?? 0,
  );
  const [blushMaterial, setBlushMaterial] = useState(
    initialValues?.blushMaterial ?? 0,
  );

  const [showConcealer, setShowConcealer] = useState(
    initialValues?.showConcealer ?? false,
  );
  const [concealerColor, setConcealerColor] = useState(
    initialValues?.concealerColor ?? "#FFFF",
  );

  const [showHighlighter, setShowHighlighter] = useState(
    initialValues?.showHighlighter ?? false,
  );
  const [highlighterPattern, setHighlighterPattern] = useState(
    initialValues?.highlighterPattern ?? 0,
  );
  const [highlighterColor, setHighlighterColor] = useState(
    initialValues?.highlighterColor ?? "#FFFF",
  );
  const [highlighterMaterial, setHighlighterMaterial] = useState(
    initialValues?.highlighterMaterial ?? 0,
  );

  const [showContour, setShowContour] = useState(
    initialValues?.showContour ?? false,
  );
  const [contourMode, setContourMode] = useState<"One" | "Dual">(
    initialValues?.contourMode ?? "One",
  );
  const [contourColors, setContourColors] = useState<string[]>(
    initialValues?.contourColors ?? [],
  );
  const [contourShape, setContourShape] = useState<string>(
    initialValues?.contourShape ?? "0",
  );

  const [showLipliner, setShowLipliner] = useState(
    initialValues?.showLipliner ?? false,
  );
  const [liplinerColor, setLiplinerColor] = useState(
    initialValues?.liplinerColor ?? "#FFFF",
  );
  const [liplinerPattern, setLiplinerPattern] = useState(
    initialValues?.liplinerPattern ?? 0,
  );

  const [showLipplumper, setShowLipplumper] = useState(
    initialValues?.showLipplumper ?? false,
  );
  const [lipplumperColor, setLipplumperColor] = useState(
    initialValues?.lipplumperColor ?? "#FFFF",
  );

  const [showLipColor, setShowLipColor] = useState(
    initialValues?.showLipColor ?? false,
  );
  const [lipColorMode, setLipColorMode] = useState<"One" | "Dual" | "Ombre">(
    initialValues?.lipColorMode ?? "One",
  );
  const [lipColors, setLipColors] = useState<string[]>(
    initialValues?.lipColors ?? [],
  );

  const [showBronzer, setShowBronzer] = useState(false);
  const [bronzerColor, setBronzerColor] = useState("#FFFF");
  const [bronzerPattern, setBronzerPattern] = useState(0);

  const [showLens, setShowLens] = useState(false);
  const [lensPattern, setLensPattern] = useState(0);

  const [showEyebrows, setShowEyebrows] = useState(false);
  const [eyebrowsPattern, setEyebrowsPattern] = useState(0);
  const [eyebrowsVisibility, setEyebrowsVisibility] = useState(0.5);
  const [eyebrowsColor, setEyebrowsColor] = useState("#FFFF");

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

        showLens,
        setShowLens,

        lensPattern,
        setLensPattern,

        showEyebrows,
        setShowEyebrows,

        eyebrowsPattern,
        setEyebrowsPattern,

        eyebrowsVisibility,
        setEyebrowsVisibility,

        eyebrowsColor,
        setEyebrowsColor,
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
