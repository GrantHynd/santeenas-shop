import { PrismaClient, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// fixed ids
const userId1 = "11111111-1111-1111-1111-111111111111";
const userId2 = "22222222-2222-2222-2222-222222222222";
const cartId1 = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const cartId2 = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

const products: Prisma.ProductCreateInput[] = [
  {
    name: "Pink Nails Set",
    description: "Santeena first ever product",
    imageUrl: "https://dummyimage.com/630x810/ed407a/fff.jpg&text=product1",
    price: 15.0,
    priceId: "price_1LOkfvKIydu32l6Y89DJmmPn",
    stock: 100,
    carts: {
      create: [
        {
          assignedBy: userId1,
          assignedAt: new Date(),
          quantity: 1,
          cart: {
            connectOrCreate: {
              where: { id: cartId1 },
              create: {
                id: cartId1,
                sessionId: randomUUID(),
              },
            },
          },
        },
        {
          assignedBy: userId2,
          assignedAt: new Date(),
          quantity: 3,
          cart: {
            connectOrCreate: {
              where: { id: cartId2 },
              create: {
                id: cartId2,
                sessionId: randomUUID(),
              },
            },
          },
        },
      ],
    },
  },
  {
    name: "Beauty Gift Set",
    description: "The perfect present",
    imageUrl: "https://dummyimage.com/630x810/ed407a/fff.jpg&text=product2",
    price: 30.0,
    priceId: "price_1LOkgcKIydu32l6YeMtvsowD",
    stock: 20,
    carts: {
      create: [
        {
          assignedBy: userId1,
          assignedAt: new Date(),
          quantity: 2,
          cart: {
            connectOrCreate: {
              where: { id: cartId1 },
              create: {
                id: cartId1,
                sessionId: randomUUID(),
              },
            },
          },
        },
        {
          assignedBy: userId2,
          assignedAt: new Date(),
          quantity: 2,
          cart: {
            connectOrCreate: {
              where: { id: cartId2 },
              create: {
                id: cartId2,
                sessionId: randomUUID(),
              },
            },
          },
        },
      ],
    },
  },
  {
    name: "Lovely Lines Nail Set",
    description: "Lines that run across across multiple nails to stand out.",
    imageUrl: "https://dummyimage.com/630x810/ed407a/fff.jpg&text=product3",
    price: 19.99,
    priceId: "price_1LOkh2KIydu32l6YsB0g6ypK",
    stock: 1,
  },
  {
    name: "Pink Biker Girl Nail Set",
    description:
      "Nails to complete the bright biker girl look, and set you apart!",
    imageUrl: "https://dummyimage.com/630x810/ed407a/fff.jpg&text=product4",
    price: 14.99,
    priceId: "price_1LOkhcKIydu32l6Y2OMFssou",
    stock: 0,
  },
];

const orders: Prisma.OrderCreateInput[] = [
  {
    stripeId:
      "cs_test_b1GQus39RkBNrCmpnvfZ3o919C1XbwO5OzGI942Bbo4TQgQ6ak1lkEYmDQ",
    price: 75.0,
    status: "complete",
    paymentStatus: "paid",
    fulfilled: true,
    customer: {
      create: {
        name: "Grant Hynd",
        email: "test_email@test.com",
        phone: "07123456789",
        addresses: {
          createMany: {
            data: [
              {
                name: "Grant's Friend",
                line1: "23 abc street",
                postalCode: "AB12 3SR",
                county: "Orange",
                city: "Machine",
                country: "GB",
              },
              {
                name: "Grant Hynd",
                line1: "Golden Mansion",
                line2: "1A Ealing Broadway",
                postalCode: "W12 1GH",
                county: "Ealing",
                city: "London",
                country: "GB",
              },
            ],
          },
        },
      },
    },
    cart: {
      connect: {
        id: cartId1,
      },
    },
  },
];

async function createProducts() {
  for (let product of products) {
    await prisma.product.create({
      data: product,
    });
  }
}

async function createOrders() {
  for (let order of orders) {
    await prisma.order.create({
      data: order,
    });
  }
}

async function main() {
  console.log(`Start seeding ...`);

  await prisma.product.deleteMany();
  console.log("Deleted all products");

  await prisma.order.deleteMany();
  console.log("Deleted all orders");

  await createProducts();
  console.log("Added products");

  await createOrders();
  console.log("Added orders");

  console.log(`Finished seeding ...`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
