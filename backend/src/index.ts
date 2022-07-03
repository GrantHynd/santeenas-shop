import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

const includeProductsResponse = {
  products: {
    select: {
      product: true,
      quantity: true,
    },
  },
};

/**
 * Get all products.
 */
app.get("/products", async (req, res, next) => {
  const { orderByPrice } = req.query;

  try {
    const products = await prisma.product.findMany({
      orderBy: {
        price: orderByPrice as Prisma.SortOrder,
      },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

/**
 * Get a product.
 */
app.get("/products/:id", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
});

/**
 * Create a new cart with it's first product.
 */
app.post("/carts/", async (req, res, next) => {
  const data: Prisma.CartCreateInput = {
    sessionId: randomUUID(),
    products: {
      create: {
        quantity: req.body.quantity,
        product: {
          connect: { id: req.body.productId },
        },
      },
    },
  };

  try {
    const cart = await prisma.cart.create<Prisma.CartCreateArgs>({
      data,
      include: includeProductsResponse,
    });
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

/**
 * Update a cart with a product, or update the quantity of a product in the cart.
 */
app.patch("/carts/:id", async (req, res, next) => {
  const data: Prisma.CartUpdateInput = {
    products: {
      upsert: {
        where: {
          productId_cartId: {
            productId: req.body.productId,
            cartId: req.params.id,
          },
        },
        create: {
          quantity: req.body.quantity,
          product: {
            connect: { id: req.body.productId },
          },
        },
        update: {
          quantity: { increment: req.body.quantity },
        },
      },
    },
  };

  try {
    const cart = await prisma.cart.update<Prisma.CartUpdateArgs>({
      where: { id: req.params.id },
      data,
      include: includeProductsResponse,
    });
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

/**
 * Get a cart by it's session id.
 */
app.get("/carts/:sessionId", async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { sessionId: req.params.sessionId },
      include: includeProductsResponse,
    });
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

/*
 * Remove a product from a cart.
 */
app.delete("/carts/:cartId/products/:productId", async (req, res, next) => {
  try {
    const deletedCartItem =
      await prisma.productsInCarts.delete<Prisma.ProductsInCartsDeleteArgs>({
        where: {
          productId_cartId: {
            productId: req.params.productId,
            cartId: req.params.cartId,
          },
        },
      });
    res.json(deletedCartItem);
  } catch (error) {
    next(error);
  }
});

/*
 * Delete Cart.
 */
app.delete("/carts/:id", async (req, res, next) => {
  try {
    const deletedCart = await prisma.cart.delete<Prisma.CartDeleteArgs>({
      where: {
        id: req.params.id,
      },
    });
    res.json(deletedCart);
  } catch (error) {
    next(error);
  }
});

app.listen(8000, () =>
  console.log(`🚀 Server ready at: http://localhost:8000`)
);
