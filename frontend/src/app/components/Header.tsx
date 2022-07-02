import React, { useContext, useMemo, useState } from "react";

import { Box, Button, Grid, Link, Typography } from "@mui/material";
import * as xLink from "next/link";
import CartIcon from "@mui/icons-material/ShoppingBasketOutlined";

import {
  CartActionType,
  CartContext,
  CartDispatchContext,
} from "../../carts/cartContext";

export function Header() {
  return (
    <React.Fragment>
      <Grid
        container
        item
        xs={12}
        direction="column"
        alignContent="center"
        bgcolor="primary.main"
        padding={10}
        spacing={2}
      >
        <Typography variant="h3" color="#fff">
          <xLink.default href="/" passHref={true}>
            <Link color="#fff">Santeena's Shop</Link>
          </xLink.default>
        </Typography>
        <Typography variant="body1" color="#fff">
          customise your look
        </Typography>
      </Grid>
      <Navigation />
    </React.Fragment>
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
