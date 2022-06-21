import React, { useState } from "react";

import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import * as xLink from "next/link";
import CartIcon from "@mui/icons-material/ShoppingBasketOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import { Product } from "../../products/api";

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
  //TODO: replace with a user's cart items
  const [cartItems, setCartItems] = useState<Array<Product>>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer =
    (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setIsOpen(isOpen);
    };

  return (
    <Grid
      container
      flexDirection="row-reverse"
      bgcolor="primary.main"
      paddingY={1}
    >
      <Box sx={{ marginX: 2, display: "flex", gap: 1 }}>
        <Button
          onClick={toggleDrawer(true)}
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
            {cartItems.length === 0 ? "" : cartItems.length}
          </Typography>
        </Button>
        <SwipeableDrawer
          anchor="right"
          open={isOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          <Grid container sx={{ width: 400 }} gap={1} marginX={2} marginY={2}>
            <Grid item xs={10}>
              <Typography variant="h5">Cart</Typography>
            </Grid>
            <Grid item xs={1}>
              <Button onClick={toggleDrawer(false)}>
                <CloseIcon />
              </Button>
            </Grid>
          </Grid>
          <Divider />
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {cartItems.length === 0 && (
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
            )}
          </div>
        </SwipeableDrawer>
      </Box>
    </Grid>
  );
}
