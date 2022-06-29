import { createContext } from "react";

import { CartResponse } from "./api";

export enum CartActionType {
  UPDATE = "UPDATE",
}

export type CartAction = {
  type: CartActionType;
  payload?: CartResponse;
};

export const CartContext = createContext<CartResponse | undefined>(undefined);

export const CartDispatchContext = createContext<
  React.Dispatch<CartAction> | undefined
>(undefined);

export const initCart: CartResponse = {
  sessionId: "",
};

export function cartReducer(state: CartResponse, action: CartAction) {
  switch (action.type) {
    case CartActionType.UPDATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
