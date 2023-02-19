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
      <div className="flex mx-4">
        <button
          className="flex text-white hover:text-primary-700 gap-2 p-2 cursor-pointer"
          onClick={() => cartDispatch?.({ type: CartActionType.OPEN })}
        >
          <BasketIcon width={24} height={24} />
          <span className="text-white">
            {totalCartItems === 0 ? "" : totalCartItems}
          </span>
        </button>
      </div>
    </div>
  );
}
