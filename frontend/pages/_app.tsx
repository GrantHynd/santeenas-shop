import React, { useCallback, useEffect, useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Cookies from "js-cookie";

import "./styles.css";
import { Header } from "../src/app/components/Header";
import { CartResponse, getCart } from "../src/carts/api";
import { CartItemsContext } from "../src/carts/cartContext";

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
export default function MyApp({ Component = React.Component, pageProps = {} }) {
  const [cartIdCookie] = useState(Cookies.get("cart") || undefined);
  const [cart, setCart] = useState<CartResponse | undefined>();

  const getAndSetCart = useCallback(async () => {
    if (cartIdCookie) {
      const cartResponse = await getCart(cartIdCookie);
      setCart(cartResponse);
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
      <CartItemsContext.Provider value={cart}>
        <Header />
        <Component {...pageProps} />
      </CartItemsContext.Provider>
    </ThemeProvider>
  );
}
