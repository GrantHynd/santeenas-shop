import { Product } from "@prisma/client";

export type WithProductResponse = {
  products: {
    quantity: number;
    product: Product;
  }[];
};

export const includeProductsResponse = {
  products: {
    select: {
      product: true,
      quantity: true,
    },
  },
};
