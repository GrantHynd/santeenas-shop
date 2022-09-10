import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import Stripe from "stripe";
import { includeProductsResponse } from "./utils";
import { fulfillOrder } from "./checkout/fulfilOrder";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2020-08-27",
});
const prisma = new PrismaClient();
const app = express();

// stripe checkout webhook uses raw body, all other endpoints parse json body
app.use((req, res, next) => {
  if (req.originalUrl === "/checkout-webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(cors());

type CheckoutSessionBody = {
  cart: {
    sessionId: string;
    products: {
      priceId: string;
      quantity: number;
    }[];
  };
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
    res.status(200).json(products);
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
    res.status(200).json(product);
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
    res.status(201).json(cart);
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
    res.status(201).json(cart);
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
    res.status(200).json(cart);
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
    res.status(200).json(deletedCartItem);
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
    res.status(200).json(deletedCart);
  } catch (error) {
    next(error);
  }
});

/*
 * Create Stripe's checkout session and redirect user to their hosted checkout page.
 */
app.post("/checkout-sessions", async (req, res, next) => {
  const { cart } = req.body as CheckoutSessionBody;
  const line_items = cart.products.map(({ priceId, quantity }) => {
    return { price: priceId, quantity };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "required",
      client_reference_id: cart.sessionId,
      line_items,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["GB"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "GBP",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
      ],
      success_url: `${req.headers.origin}/checkout/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}`,
    });
    res.status(201).json({ checkoutUrl: session.url });
  } catch (error) {
    next(error);
  }
});

/**
 * Get a checkout session.
 */
app.get("/checkout-sessions/:sessionId", async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId
    );
    const customer = await stripe.customers.retrieve(
      session.customer as string
    );
    res.status(200).json({ session, customer });
  } catch (error) {
    next(error);
  }
});

/**
 * Stripe webhook, listens for events from stripe's checkout page,
 * and triggers fulfil order on completed checkout session.
 */
app.post(
  "/checkout-webhook",
  express.raw({ type: "application/json" }),
  (req: express.Request, res: express.Response) => {
    const stripeSignature = req.headers["stripe-signature"];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body as Buffer,
        stripeSignature || "",
        process.env.STRIPE_WEBHOOK_SECRET_KEY || ""
      );
    } catch (err: any) {
      return res.status(400).send(`Stripe webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const stripeOrder = event.data.object as Stripe.Checkout.Session;
      fulfillOrder(prisma, stripeOrder);
    }
    res.status(200);
  }
);

app.listen(8000, () =>
  console.log(`🚀 Server ready at: http://localhost:8000`)
);
