// MakeupContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";
import { FindTheLookItems } from "../types/findTheLookItems";

interface FindTheLookContextProps {
  findTheLookItems: FindTheLookItems[] | null;
  setFindTheLookItems: React.Dispatch<
    React.SetStateAction<FindTheLookItems[] | null>
  >;
}

const FindTheLookContext = createContext<FindTheLookContextProps | undefined>(
  undefined,
);

interface FindTheLookProviderProps {
  children: ReactNode;
}

export const FindTheLookProvider: React.FC<FindTheLookProviderProps> = ({
  children,
}) => {
  const [findTheLookItems, setFindTheLookItems] = useState<
    FindTheLookItems[] | null
  >(null);
  return (
    <FindTheLookContext.Provider
      value={{
        findTheLookItems,
        setFindTheLookItems,
      }}
    >
      {children}
    </FindTheLookContext.Provider>
  );
};

export const useFindTheLook = () => {
  const context = useContext(FindTheLookContext);
  if (!context) {
    throw new Error("useFindTheLook must be used within a FindTheLookProvider");
  }
  return context;
};
