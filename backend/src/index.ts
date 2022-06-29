import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// Products
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

// Carts
const includeProductsResponse = {
  products: {
    select: {
      productId: true,
      quantity: true,
    },
  },
};

app.post("/carts/", async (req, res, next) => {
  const data: Prisma.CartCreateInput = {
    sessionId: randomUUID(),
    products: {
      create: req.body.products.map(
        (product: Prisma.ProductCreateWithoutCartsInput) => {
          const productInCart = {
            quantity: req.body.quantity,
            product: {
              connect: { id: product.id },
            },
          };
          return productInCart;
        }
      ),
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

app.patch("/carts/:id", async (req, res, next) => {
  const data: Prisma.CartUpdateInput = {
    products: {
      create: req.body.products.map(
        (product: Prisma.ProductUpdateWithoutCartsInput) => {
          const productInCart = {
            quantity: req.body.quantity,
            product: {
              connect: { id: product.id },
            },
          };
          return productInCart;
        }
      ),
    },
  };

  try {
    const cart = await prisma.cart.update<Prisma.CartUpdateArgs>({
      where: { sessionId: req.params.id },
      data,
      include: includeProductsResponse,
    });
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

app.get("/carts/:id", async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { sessionId: req.params.id },
      include: includeProductsResponse,
    });
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

app.listen(8000, () =>
  console.log(`🚀 Server ready at: http://localhost:8000`)
);
