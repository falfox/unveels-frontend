import { createContext, useContext, useState } from "react";

interface CriteriaContextType {
  criterias: {
    facePosition: boolean;
    lighting: boolean;
    orientation: boolean;
  };
  setCriterias: React.Dispatch<
    React.SetStateAction<{
      facePosition: boolean;
      lighting: boolean;
      orientation: boolean;
    }>
  >;
}

const CriteriaContext = createContext<CriteriaContextType | undefined>(
  undefined,
);

export const CriteriaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [criterias, setCriterias] = useState({
    facePosition: false,
    lighting: false,
    orientation: false,
  });

  return (
    <CriteriaContext.Provider value={{ criterias, setCriterias }}>
      {children}
    </CriteriaContext.Provider>
  );
};

export const useCriteria = () => {
  const context = useContext(CriteriaContext);
  if (!context) {
    throw new Error("useCriteria must be used within a CriteriaProvider");
  }
  return context;
};
