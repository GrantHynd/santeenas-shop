import React, { useCallback, useEffect, useReducer, useState } from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Cookies from "js-cookie";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

import "./styles.css";
import { Header } from "../src/app/components/Header";
import { CartResponse, getCart } from "../src/carts/api";
import {
  CartActionType,
  CartDispatchContext,
  CartContext,
  cartReducer,
  initCart,
} from "../src/carts/cartContext";
import { CartDrawer } from "../src/carts/components/CartDrawer";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({
  Component = React.Component,
  pageProps = { dehydratedState: {} },
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [cartIdCookie] = useState(Cookies.get("cart") || undefined);
  const [cartState, cartDispatch] = useReducer(cartReducer, initCart);

  const getAndSetCart = useCallback(async () => {
    if (cartIdCookie) {
      const cartResponse = await getCart(cartIdCookie);
      cartDispatch({
        type: CartActionType.UPDATE,
        payload: { cart: cartResponse as CartResponse },
      });
    }
  }, [cartIdCookie, getCart]);

  useEffect(() => {
    getAndSetCart();
  }, [getAndSetCart]);

  useEffect(() => {
    if (cartIdCookie === undefined) {
      Cookies.remove("cart");
    } else {
      Cookies.set("cart", cartIdCookie);
    }
  }, [cartIdCookie]);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <CartDispatchContext.Provider value={cartDispatch}>
          <CartContext.Provider value={cartState}>
            <CartDrawer />
            <Header />
            <Component {...pageProps} />
          </CartContext.Provider>
        </CartDispatchContext.Provider>
      </Hydrate>
    </QueryClientProvider>
  );
}
