import { useContext, useState } from "react";

import Cookies from "js-cookie";
import { useMutation, useQuery } from "react-query";

import { getCart, patchCart, postCart } from "./api";
import { CartActionType, CartDispatchContext } from "./cartContext";
import { Product } from "../products/api";

type PostCartData = {
  data: {
    products: Product[];
    quantity: number;
  };
};

type PatchCartData = {
  id: string;
  data: PostCartData["data"];
};

export function useCart(cartId?: string) {
  const cartDispatch = useContext(CartDispatchContext);
  const [cartUpdated, setCartUpdated] = useState(false);
  const sessionId = Cookies.get("cart");

  function createOrUpdateCart(product: Product) {
    //TODO: When item is already in cart, and user clicks to add to cart again, the quantity is incremented.
    if (Cookies.get("cart") === undefined) {
      createCart({
        data: {
          products: [product as Product],
          quantity: 1,
        },
      });
    } else {
      updateCart({
        id: Cookies.get("cart") as string,
        data: {
          products: [product as Product],
          quantity: 1,
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
      onSuccess: (cart) => {
        console.log("success with creating cart");
        Cookies.set("cart", cart.sessionId);
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
      onSuccess: (cart) => {
        console.log("success with updating cart");
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
      onSuccess: (cart) => {
        console.log("fetched new cart after update");
        cartDispatch?.({ type: CartActionType.UPDATE, payload: cart });
        setCartUpdated(false);
      },
    }
  );

  return { createOrUpdateCart, createCart, updateCart, updatedCart };
}
