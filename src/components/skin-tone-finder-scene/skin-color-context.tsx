import { createContext, useState, ReactNode, useContext } from "react";

// Define the types for skin color and context
type SkinType =
  | "Fair Skin"
  | "Medium Skin"
  | "Olive Skin"
  | "Tan Skin"
  | "Brown Skin"
  | "Deep Skin";

interface SkinColorContextType {
  hexColor: string;
  hexSkin: string;
  skinType: SkinType | null;
  setSkinColor: (hexSkin: string, type: SkinType) => void;
  setHexColor: (hex: string) => void;
}

// Create the context with an undefined initial value
const SkinColorContext = createContext<SkinColorContextType | undefined>(
  undefined,
);

// Provider component
export const SkinColorProvider = ({ children }: { children: ReactNode }) => {
  const [hexColor, setHexColorState] = useState<string>("#FFFFFF"); // Existing state
  const [hexSkin, setHexSkin] = useState<string>("#FFFFFF"); // New state
  const [skinType, setSkinType] = useState<SkinType | null>(null);

  // Setter to update hexSkin and skinType
  const setSkinColor = (hexSkin: string, type: SkinType) => {
    setHexSkin(hexSkin);
    setSkinType(type);
  };

  // Existing setter to update only hexColor
  const setHexColor = (hex: string) => {
    setHexColorState(hex);
  };

  return (
    <SkinColorContext.Provider
      value={{ hexColor, hexSkin, skinType, setSkinColor, setHexColor }}
    >
      {children}
    </SkinColorContext.Provider>
  );
};

// Custom hook for consuming the context
export const useSkinColor = (): SkinColorContextType => {
  const context = useContext(SkinColorContext);
  if (!context) {
    throw new Error("useSkinColor must be used within a SkinColorProvider");
  }
  return context;
};
