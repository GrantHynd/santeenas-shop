import { useContext, useState } from "react";

import Cookies from "js-cookie";
import { useMutation, useQuery } from "react-query";

import {
  CartPatchRequest,
  CartPostRequest,
  getCart,
  patchCart,
  postCart,
} from "./api";
import {
  CartActionType,
  CartContext,
  CartDispatchContext,
} from "./cartContext";

type PostCartData = {
  data: CartPostRequest;
};

type PatchCartData = {
  id: string;
  data: CartPatchRequest;
};

/**
 * Hook to manage triggering cart updates and updating UI state
 * @returns callback to trigger mutation + cart response
 */
export function useCart() {
  const { cart } = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);
  const [cartUpdated, setCartUpdated] = useState(false);
  const sessionId = Cookies.get("cart");

  function createOrUpdateCart(productId: string, quantity: number) {
    if (!cart?.sessionId) {
      createCart({
        data: {
          productId,
          quantity,
        },
      });
    } else {
      updateCart({
        id: cart.id as string,
        data: {
          productId,
          quantity,
        },
      });
    }
  }

  const { mutate: createCart } = useMutation(
    ({ data }: PostCartData) => postCart(data),
    {
      onError: () => {
        console.log("error with creating cart");
      },
      onSuccess: () => {
        setCartUpdated(true);
      },
    }
  );
  const { mutate: updateCart } = useMutation(
    ({ id, data }: PatchCartData) => patchCart(id, data),
    {
      onError: () => {
        console.log("error with updating cart");
      },
      onSuccess: () => {
        setCartUpdated(true);
      },
    }
  );
  const { data: updatedCart } = useQuery(
    ["cart", sessionId],
    () => getCart(sessionId as string),
    {
      enabled: cartUpdated,
      onError: () => {
        console.log("error: cart no refreshed");
      },
      onSuccess: (updatedCart) => {
        cartDispatch?.({
          type: CartActionType.UPDATE,
          payload: { isCartOpen: true, cart: updatedCart },
        });
        setCartUpdated(false);
      },
    }
  );

  return { createOrUpdateCart, updatedCart };
}
