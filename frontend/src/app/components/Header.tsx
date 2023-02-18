import React, { useContext, useMemo, useState } from "react";

import { Box, Button, Grid, Typography } from "@mui/material";
import Link from "next/link";
import CartIcon from "@mui/icons-material/ShoppingBasketOutlined";

import {
  CartActionType,
  CartContext,
  CartDispatchContext,
} from "../../carts/cartContext";

export function Header() {
  return (
    <>
      <div className="flex justify-center bg-primary">
        <div className="flex flex-col mt-14 px-6">
          <Link href="/" passHref={true}>
            <a className="text-4xl text-white">Santeena's Shop</a>
          </Link>
          <span className="text-md text-white">customise your look</span>
        </div>
      </div>
      <Navigation />
    </>
  );
}

function Navigation() {
  const { cart } = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);

  const totalCartItems = useMemo(() => {
    return cart?.products?.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
  }, [cart]);

  return (
    <Grid
      container
      flexDirection="row-reverse"
      bgcolor="primary.main"
      paddingY={1}
    >
      <Box sx={{ marginX: 2, display: "flex", gap: 1 }}>
        <Button
          onClick={() => cartDispatch?.({ type: CartActionType.OPEN })}
          sx={{
            gap: 1,
            color: "#fff",
            cursor: "pointer",
            "&:hover": {
              color: "primary.dark",
            },
          }}
        >
          <CartIcon />
          <Typography variant="body1" color="#fff">
            {totalCartItems === 0 ? "" : totalCartItems}
          </Typography>
        </Button>
      </Box>
    </Grid>
  );
}
