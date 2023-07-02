import React, { useContext, useMemo } from "react";

import BasketIcon from "../../../public/images/shopping-basket.svg";

import {
  CartActionType,
  CartContext,
  CartDispatchContext,
} from "../../carts/cartContext";

export default function Navigation() {
  const { cart } = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);

  const totalCartItems = useMemo(
    () => cart?.products?.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  return (
    <div className="flex flex-row-reverse pt-4 bg-primary">
      <div className="flex mx-4 mb-2">
        <button
          className="btn btn-ghost gap-2 text-white"
          onClick={() => cartDispatch?.({ type: CartActionType.OPEN })}
        >
          <BasketIcon width={24} height={24} />
          {totalCartItems === 0 ? "" : totalCartItems}
        </button>
      </div>
    </div>
  );
}
