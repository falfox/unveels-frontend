import { createContext, useState, ReactNode, useContext } from "react";
import { SkinType } from "../../utils/colorUtils";

interface SkinColorContextType {
  hexColor: string;
  skinType: SkinType | null;
  setSkinColor: (hex: string, type: SkinType) => void;
}

const SkinColorContext = createContext<SkinColorContextType | undefined>(
  undefined,
);

export const SkinColorProvider = ({ children }: { children: ReactNode }) => {
  const [hexColor, setHexColor] = useState<string>("#FFFFFF");
  const [skinType, setSkinType] = useState<SkinType | null>(null);

  const setSkinColor = (hex: string, type: SkinType) => {
    setHexColor(hex);
    setSkinType(type);
  };

  return (
    <SkinColorContext.Provider value={{ hexColor, skinType, setSkinColor }}>
      {children}
    </SkinColorContext.Provider>
  );
};

export const useSkinColor = (): SkinColorContextType => {
  const context = useContext(SkinColorContext);
  if (!context) {
    throw new Error("useSkinColor must be used within a SkinColorProvider");
  }
  return context;
};
