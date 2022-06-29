import Head from "next/head";
import Image from "next/image";
import * as xLink from "next/link";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { useCart } from "../src/carts/useCart";
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
  const { createOrUpdateCart } = useCart();
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
                <xLink.default href={`/products/${product.id}`} passHref={true}>
                  <Link>
                    <Image
                      layout="responsive"
                      width="320"
                      height="400"
                      src={product.imageUrl}
                      alt={product.description}
                    />
                  </Link>
                </xLink.default>
                <CardContent>
                  <xLink.default
                    href={`/products/${product.id}`}
                    passHref={true}
                  >
                    <Link>
                      <Typography gutterBottom variant="h5" component="div">
                        {product.name}
                      </Typography>
                    </Link>
                  </xLink.default>
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
