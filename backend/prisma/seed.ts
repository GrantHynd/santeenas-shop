import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const products: Prisma.ProductCreateManyInput[] = [
  {
    name: "Pink Nails Set",
    description: "Santeena first ever product",
    imageUrl: "https://dummyimage.com/630x810/ed407a/fff.jpg&text=product1",
    price: 15.0,
    stock: 100,
  },
  {
    name: "Beauty Gift Set",
    description: "The perfect present",
    imageUrl: "https://dummyimage.com/630x810/ed407a/fff.jpg&text=product2",
    price: 30.0,
    stock: 20,
  },
  {
    name: "Lovely Lines Nail Set",
    description: "Lines that run across across multiple nails to stand out.",
    imageUrl: "https://dummyimage.com/630x810/ed407a/fff.jpg&text=product3",
    price: 19.99,
    stock: 1,
  },
  {
    name: "Pink Biker Girl Nail Set",
    description:
      "Nails to complete the bright biker girl look, and set you apart!",
    imageUrl: "https://dummyimage.com/630x810/ed407a/fff.jpg&text=product4",
    price: 14.99,
    stock: 0,
  },
];

async function main() {
  console.log(`Start seeding ...`);

  await prisma.product.deleteMany();
  console.log("Deleted all products");

  await prisma.product.createMany({
    data: products,
  });
  console.log("Added product data");

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
