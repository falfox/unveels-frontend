// MakeupContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";
import { Texture } from "three";

interface AccesoriesContextProps {
  envMapAccesories: Texture | null;
  setEnvMapAccesories: (texture: Texture | null) => void;
}

const AccesoriesContext = createContext<AccesoriesContextProps | undefined>(
  undefined,
);

interface AccesoriesProviderProps {
  children: ReactNode;
}

export const AccesoriesProvider: React.FC<AccesoriesProviderProps> = ({
  children,
}) => {
  const [envMapAccesories, setEnvMapAccesories] = useState<Texture | null>(
    null,
  );

  return (
    <AccesoriesContext.Provider
      value={{
        envMapAccesories,
        setEnvMapAccesories,
      }}
    >
      {children}
    </AccesoriesContext.Provider>
  );
};

export const useAccesories = () => {
  const context = useContext(AccesoriesContext);
  if (!context) {
    throw new Error("useAccesories must be used within a AccesoriesProvider");
  }
  return context;
};
