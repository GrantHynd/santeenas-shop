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
import Cookies from "js-cookie";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { useCart } from "../src/carts/useCart";
import { getProducts, Product } from "../src/products/api";
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
  const { createCart, updateCart } = useCart();
  const { data: products } = useQuery("products", getProducts);

  async function addItemToCart(e: React.MouseEvent, product?: Product) {
    //TODO: When item is already in cart, and user clicks to add to cart again, the quantity is incremented.
    if (Cookies.get("cart") === undefined) {
      createCart({
        data: {
          products: [product as Product],
          quantity: 1,
        },
      });
    } else {
      updateCart({
        id: Cookies.get("cart") as string,
        data: {
          products: [product as Product],
          quantity: 1,
        },
      });
    }
  }

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
                    onClick={(e) => addItemToCart(e, product)}
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
