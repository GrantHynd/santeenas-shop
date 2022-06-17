import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

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

app.listen(8000, () =>
  console.log(`🚀 Server ready at: http://localhost:8000`)
);
