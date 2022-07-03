import { useContext, useState } from "react";

import Cookies from "js-cookie";
import { useMutation, useQuery } from "react-query";

import {
  deleteCart,
  deleteCartItem,
  DeleteCartItemParams,
  getCart,
} from "../api";
import {
  CartAction,
  CartActionType,
  CartContext,
  CartDispatchContext,
  initCart,
} from "../cartContext";

type DeleteCartItemParamsWithoutCartId = Omit<DeleteCartItemParams, "cartId">;

/**
 * Hook to manage removing items from a cart as well as deleting a cart when it becomes empty.
 * @returns mutation from removing items + cart response
 */
export function useDeleteCartItem() {
  const { cart } = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);
  const [cartItemDeleted, setCartItemDeleted] = useState(false);

  const { mutate: removeCartItem } = useMutation(
    ({ productId }: DeleteCartItemParamsWithoutCartId) =>
      deleteCartItem({ cartId: cart?.id as string, productId }),
    {
      onError: () => {
        console.log("error with deleting cart item");
      },
      onSuccess: () => {
        setCartItemDeleted(true);
      },
    }
  );
  const { mutate: removeCart } = useMutation(
    () => deleteCart({ id: cart?.id as string }),
    {
      onError: () => {
        console.log("error with deleting cart");
      },
      onSuccess: () => {
        Cookies.remove("cart");
      },
    }
  );
  const { data: updatedCart } = useQuery(
    ["cart", cart?.sessionId],
    () => getCart(cart?.sessionId as string),
    {
      enabled: cartItemDeleted,
      onError: () => {
        console.log("error: cart no refreshed");
      },
      onSuccess: (updatedCart) => {
        if (updatedCart) {
          let payload: CartAction["payload"] = { cart: updatedCart };
          if (!updatedCart.products || updatedCart.products.length === 0) {
            removeCart();
            payload = initCart;
          }
          cartDispatch?.({
            type: CartActionType.UPDATE,
            payload,
          });
        }

        setCartItemDeleted(false);
      },
    }
  );
  return { removeCartItem, updatedCart };
}
