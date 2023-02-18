import Cookies from "js-cookie";
import { Stripe } from "stripe";
import { httpDelete, httpGet, httpPatch, httpPost } from "../app/makeRequest";

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

export type CheckoutSessionBody = {
  cart: {
    sessionId: string;
    products: {
      priceId: string;
      quantity: number;
    }[];
  };
};

export type PostCheckoutSessionResponse = {
  checkoutUrl: string;
};

export type GetCheckoutSessionResponse = {
  session: Stripe.Response<Stripe.Checkout.Session>;
  customer: Stripe.Response<Stripe.Customer>;
};

export async function postCheckoutSessions(body: CheckoutSessionBody) {
  const data = await httpPost<CheckoutSessionBody, PostCheckoutSessionResponse>(
    "http://localhost:8000/checkout-sessions/",
    body
  );
  return data;
}

export async function getCheckoutSession(id: string) {
  const data = await httpGet<GetCheckoutSessionResponse>(
    `http://localhost:8000/checkout-sessions/${id}`
  );
  return data;
}

export async function postCart(body: CartPostRequest) {
  const data = await httpPost<CartPostRequest, CartResponse>(
    "http://localhost:8000/carts/",
    body
  );
  return data;
}

export async function patchCart(id: string, body: CartPatchRequest) {
  const data = await httpPatch<CartPatchRequest, CartResponse>(
    `http://localhost:8000/carts/${id}`,
    body
  );
  return data;
}

export async function getCart(id: string) {
  const data = await httpGet<CartResponse>(`http://localhost:8000/carts/${id}`);
  if (!data) {
    Cookies.remove("cart");
  }
  return data;
}

export async function deleteCartItem({
  cartId,
  productId,
}: DeleteCartItemParams) {
  const data = await httpDelete<DeleteCartItemResponse>(
    `http://localhost:8000/carts/${cartId}/products/${productId}`
  );
  return data;
}

export async function deleteCart({ id }: DeleteCartParams) {
  const response = await fetch(`http://localhost:8000/carts/${id}`);
  const data: DeleteCartResponse = await response.json();
  return data;
}
