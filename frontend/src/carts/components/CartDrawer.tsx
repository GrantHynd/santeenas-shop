import React, { useCallback, useContext, useMemo } from "react";

import {
  Button,
  Divider,
  Grid,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
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

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

function convertCartForCheckout(cart: CartResponse | undefined) {
  if (!cart || !cart.products) {
    throw Error("No cart or products exists to proceed to checkout!");
  }
  return {
    cart: {
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
    <SwipeableDrawer
      anchor="right"
      open={isCartOpen}
      onOpen={(e) => toggleDrawer(e, true)}
      onClose={(e) => toggleDrawer(e, false)}
    >
      <Grid container sx={{ width: 400 }} gap={1} paddingX={2} paddingY={2}>
        <Grid item xs={10}>
          <Typography variant="h5">Cart</Typography>
        </Grid>
        <Grid item xs={1} sx={{ textAlign: "center" }}>
          <Button onClick={(e) => toggleDrawer(e, false)}>
            <CloseIcon />
          </Button>
        </Grid>
      </Grid>
      <Divider />
      <div style={{ position: "relative", width: 400, height: "100%" }}>
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
                  <Grid container gap={1} marginX={2} marginY={2}>
                    <Grid item>
                      <Image
                        src={item.product.imageUrl}
                        layout="fixed"
                        width={150}
                        height={200}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1">
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2">
                        £{convertToDisplayPrice(item.product.price)}
                      </Typography>
                      <Typography variant="body2">
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography
                        onClick={() =>
                          removeCartItem({ productId: item.product.id })
                        }
                        variant="body2"
                        sx={{ color: "primary.main", cursor: "pointer" }}
                      >
                        Remove item
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                </React.Fragment>
              );
            })}
            <Divider />
            <Grid container sx={{ width: 400 }} paddingX={2} paddingY={2}>
              <Grid item xs={12}>
                <Typography variant="body2" marginBottom={2}>
                  Shipping and taxes calculated at checkout
                </Typography>
                <form onSubmit={(e) => onCheckout(e)}>
                  <Button type="submit" variant="contained" fullWidth>
                    Checkout - £
                    {convertToDisplayPrice(totalCartPrice as number)}
                  </Button>
                </form>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    </SwipeableDrawer>
  );
}
