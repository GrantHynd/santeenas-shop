import React, { useCallback, useContext, useMemo } from "react";

import CloseIcon from "@mui/icons-material/CloseOutlined";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";

import { convertToDisplayPrice } from "../../products/utils";
import useCheckout from "../hooks/useCheckout";
import { useDeleteCartItem } from "../hooks/useDeleteCartItem";
import {
  CartActionType,
  CartContext,
  CartDispatchContext,
} from "../cartContext";
import { CartResponse } from "../api";
import Drawer from "../../app/components/Drawer";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

function convertCartForCheckout(cart: CartResponse | undefined) {
  if (!cart || !cart.products) {
    throw Error("No cart or products exists to proceed to checkout!");
  }
  return {
    cart: {
      sessionId: cart.sessionId,
      products: cart.products?.map(({ product, quantity }) => {
        return { priceId: product.priceId, quantity };
      }),
    },
  };
}

export function CartDrawer() {
  const { isCartOpen, cart } = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);
  const { removeCartItem } = useDeleteCartItem();
  const { checkout } = useCheckout();

  const totalCartPrice = useMemo(() => {
    return cart?.products?.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);
  }, [cart]);

  function toggleDrawer(e: React.SyntheticEvent<{}, Event>, isOpen: boolean) {
    if (
      e &&
      e.type === "keydown" &&
      ((e as React.KeyboardEvent).key === "Tab" ||
        (e as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    cartDispatch?.({
      type: isOpen ? CartActionType.OPEN : CartActionType.CLOSE,
    });
  }

  const onCheckout = useCallback(
    (e: React.SyntheticEvent<{}, Event>) => {
      e.preventDefault();
      checkout(convertCartForCheckout(cart));
    },
    [cart, checkout]
  );

  return (
    <Drawer isOpen={isCartOpen} onClose={(e) => toggleDrawer(e, false)}>
      <div className="flex flex-wrap p-4 justify-between align-items-center content-center">
        <h3 className="text-xl">Cart</h3>
        <div className="">
          <button
            onClick={(e) => toggleDrawer(e, false)}
            className="btn btn-outline btn-square btn-primary"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
      <div className="divider" />
      <div>
        {!cart?.products ? (
          <div
            style={{
              position: "absolute",
              width: "100%",
              top: "50%",
              textAlign: "center",
            }}
          >
            Your cart is empty
          </div>
        ) : (
          <div>
            {cart?.products.map((item) => {
              return (
                <React.Fragment key={item.product.id}>
                  <div className="flex space-x-4 p-4">
                    <div>
                      <Image
                        src={item.product.imageUrl}
                        width={150}
                        height={200}
                        alt={item.product.description}
                      />
                    </div>
                    <div>
                      <h4 className="text-lg">{item.product.name}</h4>
                      <p className="text-base">
                        £{convertToDisplayPrice(item.product.price)}
                      </p>
                      <p className="text-base">Quantity: {item.quantity}</p>
                      <button
                        className="btn btn-link min-h-0 pl-0"
                        onClick={() =>
                          removeCartItem({ productId: item.product.id })
                        }
                      >
                        Remove item
                      </button>
                    </div>
                  </div>
                  <div className="divider"></div>
                </React.Fragment>
              );
            })}
            <div className="mt-4 px-4">
              <div className="">
                <p className="text-base">
                  Shipping and taxes calculated at checkout
                </p>
                <form onSubmit={(e) => onCheckout(e)}>
                  <button type="submit" className="btn btn-primary btn-block">
                    Checkout - £
                    {convertToDisplayPrice(totalCartPrice as number)}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
