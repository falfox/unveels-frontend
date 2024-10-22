import React, { createContext, useState, useContext } from "react";

interface LashesContextType {
  colorFamily: string | null;
  setColorFamily: (color: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
}

// Create the context
const LashesContext = createContext<LashesContextType | undefined>(undefined);

// Create a provider component
export function LashesProvider({ children }: { children: React.ReactNode }) {
  const [colorFamily, setColorFamily] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  return (
    <LashesContext.Provider
      value={{
        colorFamily,
        setColorFamily,
        selectedColor,
        setSelectedColor,
      }}
    >
      {children}
    </LashesContext.Provider>
  );
}

// Custom hook to use the context
export function useLashesContext() {
  const context = useContext(LashesContext);
  if (context === undefined) {
    throw new Error("useLashesContext must be used within a LashesProvider");
  }
  return context;
}