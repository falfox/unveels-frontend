import React, { createContext, useState, useContext } from "react";

interface ContourContextType {
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  selectedShape: string | null;
  setSelectedShape: (shape: string | null) => void;
  selectedMode: string | null;
  setSelectedMode: (mode: string | null) => void;
}

// Create the context
const ContourContext = createContext<ContourContextType | undefined>(undefined);

// Create a provider component
export function ContourProvider({ children }: { children: React.ReactNode }) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  return (
    <ContourContext.Provider
      value={{
        selectedColor,
        setSelectedColor,
        selectedShape,
        setSelectedShape,
        selectedMode,
        setSelectedMode,
      }}
    >
      {children}
    </ContourContext.Provider>
  );
}

// Custom hook to use the context
export function useContourContext() {
  const context = useContext(ContourContext);
  if (context === undefined) {
    throw new Error("useContourContext must be used within a ContourProvider");
  }
  return context;
}
