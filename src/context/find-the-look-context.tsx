import React, { createContext, ReactNode, useContext, useState } from "react";
import { FindTheLookItems } from "../types/findTheLookItems";

interface Tabs {
  tab: string;
  section: string;
}

interface FindTheLookContextProps {
  findTheLookItems: FindTheLookItems[] | null;
  setFindTheLookItems: React.Dispatch<
    React.SetStateAction<FindTheLookItems[] | null>
  >;
  tabs: Tabs;
  setTabs: React.Dispatch<React.SetStateAction<Tabs>>;
}

const FindTheLookContext = createContext<FindTheLookContextProps | undefined>(
  undefined
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

  // State untuk tabs
  const [tabs, setTabs] = useState<Tabs>({ tab: "", section: "" });

  return (
    <FindTheLookContext.Provider
      value={{
        findTheLookItems,
        setFindTheLookItems,
        tabs,
        setTabs,
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
