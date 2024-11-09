import React, {
  createContext,
  useState,
  useContext,
  useReducer,
  useEffect,
} from "react";
import { Product } from "../../api/shared";

interface FindThelookContextType {
  selectedItems: {
    items: Product[];
  };
  dispatch: React.Dispatch<Action>;
  view: "face" | "single_category" | "recommendations" | "all_categories";
  setView: React.Dispatch<
    React.SetStateAction<
      "face" | "single_category" | "recommendations" | "all_categories"
    >
  >;
}

// Create the context
const FindTheLookContext = createContext<FindThelookContextType | undefined>(
  undefined,
);

type Action =
  | { type: "add"; payload: Product }
  | { type: "remove"; payload: Product }
  | { type: "reset" };

function cartReducer(
  state: {
    items: Product[];
  },
  action: Action,
) {
  switch (action.type) {
    case "add":
      // Check if the item is already selected
      if (state.items.find((item) => item.id === action.payload.id)) {
        return state;
      }

      return {
        items: [...state.items, action.payload],
      };
    case "remove":
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    case "reset":
      return {
        items: [],
      };
    default:
      return state;
  }
}

// Create a provider component
export function FindTheLookProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //   Make a cart reducer with `useReducer`
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
  });

  const [view, setView] = useState<FindThelookContextType["view"]>("face");

  return (
    <FindTheLookContext.Provider
      value={{
        selectedItems: cart,
        dispatch,
        view,
        setView,
      }}
    >
      {children}
    </FindTheLookContext.Provider>
  );
}

// Custom hook to use the context
export function useFindTheLookContext() {
  const context = useContext(FindTheLookContext);
  if (context === undefined) {
    throw new Error(
      "useFindTheLookContext must be used within a FindTheLookProvider",
    );
  }
  return context;
}
