import React, { createContext, useState, useContext, useReducer } from "react";
import { Product } from "../../api/shared";

interface FindThelookContextType {
  cart: {
    items: Product[];
  };
  dispatch: React.Dispatch<Action>;
}

// Create the context
const FindTheLookContext = createContext<FindThelookContextType | undefined>(
  undefined,
);

type Action =
  | { type: "add"; payload: Product }
  | { type: "remove"; payload: Product };

function cartReducer(
  state: {
    items: Product[];
  },
  action: Action,
) {
  switch (action.type) {
    case "add":
      return {
        items: [...state.items, action.payload],
      };
    case "remove":
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    default:
      return state;
  }
}

// Create a provider component
export function FindTheLookProvider({ children }: { children: React.ReactNode }) {
  //   Make a cart reducer with `useReducer`
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
  });

  return (
    <FindTheLookContext.Provider
      value={{
        cart,
        dispatch,
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
    throw new Error("useFindTheLookContext must be used within a FindTheLookProvider");
  }
  return context;
}
