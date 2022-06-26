import { Product } from "../products/api";

export type CartPostRequest = {
  products: Product[];
  quantity: number;
};

export type CartPatchRequest = {
  products: Product[];
  quantity: number;
};

export type CartResponse = {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  sessionId: string;
  products?: {
    productId: string;
    quantity: number;
  }[];
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
  const data: CartResponse = await response.json();
  return data;
}