import { Cart, Customer, Prisma, PrismaClient, Product } from "@prisma/client";
import Stripe from "stripe";
import { includeProductsResponse, WithProductResponse } from "../utils";

type CartWithProductResponse = Cart & WithProductResponse;

async function getOrderedCart(
  prisma: PrismaClient,
  stripeOrder: Stripe.Checkout.Session
): Promise<CartWithProductResponse | null> {
  try {
    return await prisma.cart.findUnique({
      where: { sessionId: stripeOrder.client_reference_id || "" },
      include: includeProductsResponse,
    });
  } catch (error: any) {
    throw Error(
      `Database error when getting the ordered cart: ${error.message}`
    );
  }
}

async function adjustStock(
  prisma: PrismaClient,
  cart: CartWithProductResponse
) {
  try {
    cart?.products.map(async (productInCart) => {
      const updatedStock = productInCart.product.stock - productInCart.quantity;
      const data: Prisma.ProductUpdateInput = {
        stock: updatedStock,
      };
      await prisma.product.update<Prisma.ProductUpdateArgs>({
        where: { id: productInCart.product.id },
        data,
      });
    });
  } catch (error: any) {
    throw Error(`Database error when adjusting stock: ${error.message}`);
  }
  return cart;
}

async function getCustomer(
  prisma: PrismaClient,
  stripeOrder: Stripe.Checkout.Session
) {
  try {
    return await prisma.customer.findUnique({
      where: { email: stripeOrder.customer_details?.email || "" },
    });
  } catch (error: any) {
    throw Error(`Database error when getting customer: ${error.message}`);
  }
}

async function findOrCreateAddress(
  prisma: PrismaClient,
  stripeOrder: Stripe.Checkout.Session,
  customer: Customer
) {
  const { shipping } = stripeOrder;
  const shippingAddress = {
    name: shipping?.name as string,
    line1: shipping?.address?.line1 as string,
    line2: shipping?.address?.line2 as string,
    postalCode: shipping?.address?.postal_code as string,
    city: shipping?.address?.city as string,
    country: shipping?.address?.country as string,
  };
  const addressData: Prisma.AddressCreateInput = {
    ...shippingAddress,
    customer: {
      connect: {
        id: customer.id,
      },
    },
  };

  try {
    const existingShippingAddress = await prisma.address.findFirst({
      where: { ...shippingAddress, customerId: customer.id },
    });
    if (!existingShippingAddress) {
      await prisma.address.create<Prisma.AddressCreateArgs>({
        data: addressData,
      });
    }
  } catch (error: any) {
    throw Error(
      `Database error when fetching/creating address: ${error.message}`
    );
  }
}

async function createOrder(
  prisma: PrismaClient,
  stripeOrder: Stripe.Checkout.Session,
  cart: CartWithProductResponse
) {
  const { customer_details, shipping } = stripeOrder;
  const data: Prisma.OrderCreateInput = {
    stripeId: stripeOrder.id,
    price: stripeOrder.amount_total || 0, // convert to decimal
    status: stripeOrder.status || "",
    paymentStatus: stripeOrder.payment_status,
    fulfilled: false,
    cart: {
      connect: {
        id: cart?.id,
      },
    },
    customer: {
      connectOrCreate: {
        where: { email: stripeOrder.customer_details?.email || "" },
        create: {
          name: customer_details?.name as string,
          email: customer_details?.email as string,
          phone: customer_details?.phone,
          addresses: {
            create: {
              name: shipping?.name as string,
              line1: shipping?.address?.line1 as string,
              line2: shipping?.address?.line2 as string,
              postalCode: shipping?.address?.postal_code as string,
              city: shipping?.address?.city as string,
              country: shipping?.address?.country as string,
            } as Prisma.AddressCreateInput,
          },
        },
      },
    },
  };

  try {
    await prisma.order.create<Prisma.OrderCreateArgs>({
      data,
    });
  } catch (error: any) {
    throw Error(`Database error when creating order: ${error.message}`);
  }
}

export async function fulfillOrder(
  prisma: PrismaClient,
  stripeOrder: Stripe.Checkout.Session
) {
  console.log(stripeOrder);
  const cart = await getOrderedCart(prisma, stripeOrder);
  const customer = await getCustomer(prisma, stripeOrder);

  if (!cart) {
    throw Error("No cart found for order");
  }

  if (customer) {
    await findOrCreateAddress(prisma, stripeOrder, customer);
  }

  await createOrder(prisma, stripeOrder, cart);
  await adjustStock(prisma, cart);

  // TODO: Email receipt to customer
  // TODO: Email owner to fulfil order
}
