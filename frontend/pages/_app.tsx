import React, { useCallback, useEffect, useReducer, useState } from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

import "./styles.css";
import { Header } from "../src/app/components/Header";
import { getCart } from "../src/carts/api";
import {
  CartActionType,
  CartDispatchContext,
  CartContext,
  cartReducer,
  initCart,
} from "../src/carts/cartContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ed4079",
    },
    secondary: {
      main: "#ba68c8",
    },
  },
});

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({
  Component = React.Component,
  pageProps = { dehydratedState: {} },
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [cartIdCookie] = useState(Cookies.get("cart") || undefined);
  const [cart, cartDispatch] = useReducer(cartReducer, initCart);

  const getAndSetCart = useCallback(async () => {
    if (cartIdCookie) {
      const cartResponse = await getCart(cartIdCookie);
      cartDispatch({ type: CartActionType.UPDATE, payload: cartResponse });
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
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <CartDispatchContext.Provider value={cartDispatch}>
            <CartContext.Provider value={cart}>
              <Header />
              <Component {...pageProps} />
            </CartContext.Provider>
          </CartDispatchContext.Provider>
        </Hydrate>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
