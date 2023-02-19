import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { useUpdateCart } from "../src/carts/hooks/useUpdateCart";
import { getProducts } from "../src/products/api";
import { convertToDisplayPrice } from "../src/products/utils";

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("products", () => getProducts());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function Products() {
  const { createOrUpdateCart } = useUpdateCart();
  const { data: products } = useQuery("products", getProducts);

  return (
    <div className="container">
      <Head>
        <title>Products | Styles by Santeena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Grid
          item
          container
          gap={4}
          paddingX={8}
          marginY={4}
          direction="row"
          justifyContent=""
        >
          {products?.map((product) => {
            return (
              <Card key={product.id} sx={{ width: 320 }}>
                <Link href={`/products/${product.id}`}>
                  <Image
                    sizes="100vw"
                    width="320"
                    height="400"
                    src={product.imageUrl}
                    alt={product.description}
                    className="w-full h-auto"
                  />
                </Link>
                <CardContent>
                  <Link href={`/products/${product.id}`}>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.name}
                    </Typography>
                  </Link>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    height={25}
                  >
                    {product.description}
                  </Typography>
                </CardContent>
                <CardActions style={{ justifyContent: "end" }}>
                  <Button
                    onClick={() => createOrUpdateCart(product?.id as string, 1)}
                    size="small"
                    variant="text"
                  >
                    Add to cart - £{convertToDisplayPrice(product.price)}
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Grid>
      </main>
    </div>
  );
}
