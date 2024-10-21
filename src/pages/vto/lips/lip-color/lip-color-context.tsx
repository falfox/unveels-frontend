import React, { createContext, useState, useContext } from "react";

interface LipColorContextType {
  colorFamily: string | null;
  setColorFamily: (color: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  selectedTexture: string | null;
  setSelectedTexture: (texture: string | null) => void;
  selectedShade: string | null;
  setSelectedShade: (shade: string | null) => void;
}

// Create the context
const LipColorContext = createContext<LipColorContextType | undefined>(
  undefined,
);

// Create a provider component
export function LipColorProvider({ children }: { children: React.ReactNode }) {
  const [colorFamily, setColorFamily] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedTexture, setSelectedTexture] = useState<string | null>(null);
  const [selectedShade, setSelectedShade] = useState<string | null>(null);

  return (
    <LipColorContext.Provider
      value={{
        colorFamily,
        setColorFamily,
        selectedColor,
        setSelectedColor,
        selectedTexture,
        setSelectedTexture,
        selectedShade,
        setSelectedShade,
      }}
    >
      {children}
    </LipColorContext.Provider>
  );
}

// Custom hook to use the context
export function useLipColorContext() {
  const context = useContext(LipColorContext);
  if (context === undefined) {
    throw new Error(
      "useLipColorContext must be used within a LipColorProvider",
    );
  }
  return context;
}
