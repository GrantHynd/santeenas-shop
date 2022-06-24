import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// Products
app.get("/products", async (req, res) => {
  const { orderByPrice } = req.query;

  const products = await prisma.product.findMany({
    orderBy: {
      price: orderByPrice as Prisma.SortOrder,
    },
  });

  res.json(products);
});

app.get("/products/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });
  res.json(product);
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

app.post("/carts/", async (req, res) => {
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

  const cart = await prisma.cart.create<Prisma.CartCreateArgs>({
    data,
    include: includeProductsResponse,
  });
  res.json(cart);
});

app.patch("/carts/:id", async (req, res) => {
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

  const cart = await prisma.cart.update<Prisma.CartUpdateArgs>({
    where: { sessionId: req.params.id },
    data,
    include: includeProductsResponse,
  });
  res.json(cart);
});

app.get("/carts/:id", async (req, res) => {
  const cart = await prisma.cart.findUnique({
    where: { sessionId: req.params.id },
    include: includeProductsResponse,
  });
  res.json(cart);
});

app.listen(8000, () =>
  console.log(`🚀 Server ready at: http://localhost:8000`)
);
