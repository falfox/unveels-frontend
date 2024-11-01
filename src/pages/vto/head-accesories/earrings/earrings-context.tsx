import React, { createContext, useContext, useState } from "react";

interface EarringsContextType {
  colorFamily: string | null;
  setColorFamily: (color: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  selectedStyle: string | null;
  setSelectedStyle: (shape: string | null) => void;
}

// Create the context
const EarringsContext = createContext<EarringsContextType | undefined>(
  undefined,
);

// Create a provider component
export function EarringsProvider({ children }: { children: React.ReactNode }) {
  const [colorFamily, setColorFamily] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  return (
    <EarringsContext.Provider
      value={{
        colorFamily,
        setColorFamily,
        selectedColor,
        setSelectedColor,
        selectedStyle,
        setSelectedStyle,
      }}
    >
      {children}
    </EarringsContext.Provider>
  );
}

// Custom hook to use the context
export function useEarringsContext() {
  const context = useContext(EarringsContext);
  if (context === undefined) {
    throw new Error(
      "useEarringsContext must be used within a EarringsProvider",
    );
  }
  return context;
}
