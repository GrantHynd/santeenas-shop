import { createContext } from "react";

import { CartResponse } from "./api";

export enum CartActionType {
  OPEN = "OPEN",
  CLOSE = "CLOSE",
  UPDATE = "UPDATE",
}

export type CartAction = {
  type: CartActionType;
  payload?: {
    isCartOpen?: boolean;
    cart?: CartResponse;
  };
};

export type CartState = {
  isCartOpen: boolean;
  cart?: CartResponse;
};

export const initCart: CartState = {
  isCartOpen: false,
  cart: { id: "", createdAt: "", updatedAt: "", sessionId: "" },
};

export const CartContext = createContext<CartState>(initCart);

export const CartDispatchContext = createContext<
  React.Dispatch<CartAction> | undefined
>(undefined);

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case CartActionType.OPEN:
      return { ...state, ...{ isCartOpen: true } };
    case CartActionType.CLOSE:
      return { ...state, ...{ isCartOpen: false } };
    case CartActionType.UPDATE:
      if (action.payload) {
        return { ...state, ...action.payload };
      }
      return state;
    default:
      return state;
  }
}
