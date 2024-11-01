import React, { createContext, useState, useContext } from "react";

interface BlushContextType {
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  selectedShape: string;
  setSelectedShape: (shape: string) => void;
  selectedTexture: string | null;
  setSelectedTexture: (mode: string | null) => void;
}

// Create the context
const BlushContext = createContext<BlushContextType | undefined>(undefined);

// Create a provider component
export function BlushProvider({ children }: { children: React.ReactNode }) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string>("0");
  const [selectedTexture, setSelectedTexture] = useState<string | null>(null);

  return (
    <BlushContext.Provider
      value={{
        selectedColor,
        setSelectedColor,
        selectedShape,
        setSelectedShape,
        selectedTexture,
        setSelectedTexture,
      }}
    >
      {children}
    </BlushContext.Provider>
  );
}

// Custom hook to use the context
export function useBlushContext() {
  const context = useContext(BlushContext);
  if (context === undefined) {
    throw new Error("useBlushContext must be used within a BlushProvider");
  }
  return context;
}
