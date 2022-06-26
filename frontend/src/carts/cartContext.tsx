import { createContext } from "react";

import { CartResponse } from "./api";

export const CartItemsContext = createContext<CartResponse | undefined>(
  undefined
);
