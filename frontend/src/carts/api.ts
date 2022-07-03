import Cookies from "js-cookie";

import { Product } from "../products/api";

export type CartPostRequest = {
  productId: string;
  quantity: number;
};

export type CartPatchRequest = {
  productId: string;
  quantity: number;
};

export type CartResponse = {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  sessionId: string;
  products?: {
    product: Product;
    quantity: number;
  }[];
};

export type DeleteCartItemParams = {
  cartId: string;
  productId: string;
};

export type DeleteCartItemResponse = {
  productId: string;
  cartId: string;
  quantity: number;
  assignedAt: string;
  assignedBy: string | null;
};

export type DeleteCartParams = {
  id: string;
};

export type DeleteCartResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
  sessionId: string;
};

export async function postCart(postData: CartPostRequest) {
  const response = await fetch("http://localhost:8000/carts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });
  const data: CartResponse = await response.json();
  return data;
}

export async function patchCart(id: string, patchData: CartPostRequest) {
  const response = await fetch(`http://localhost:8000/carts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patchData),
  });
  const data: CartResponse = await response.json();
  return data;
}

export async function getCart(id: string) {
  const response = await fetch(`http://localhost:8000/carts/${id}`);
  const data: CartResponse | null = await response.json();
  if (!data) {
    Cookies.remove("cart");
  }
  return data;
}

export async function deleteCartItem({
  cartId,
  productId,
}: DeleteCartItemParams) {
  const response = await fetch(
    `http://localhost:8000/carts/${cartId}/products/${productId}`,
    {
      method: "DELETE",
    }
  );
  const data: DeleteCartItemResponse = await response.json();
  return data;
}

export async function deleteCart({ id }: DeleteCartParams) {
  const response = await fetch(`http://localhost:8000/carts/${id}`, {
    method: "DELETE",
  });
  const data: DeleteCartResponse = await response.json();
  return data;
}
