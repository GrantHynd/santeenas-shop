import Cookies from "js-cookie";
import { Button, Container, Divider, Grid, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Header } from "../../src/app/components/Header";
import {
  CartResponse,
  getCart,
  patchCart,
  postCart,
} from "../../src/carts/api";
import { getProduct, getProducts, Product } from "../../src/products/api";
import { convertToDisplayPrice } from "../../src/products/utils";

export async function getStaticPaths() {
  const products = await getProducts();
  const paths = products.map((product) => ({
    params: { id: product.id },
  }));

  return { paths, fallback: true };
}

type StaticProps = {
  params: {
    id: string;
  };
};

export async function getStaticProps({ params }: StaticProps) {
  return {
    props: {
      product: await getProduct(params.id),
    },
  };
}

type ProductProps = {
  product: Product;
};

export default function ProductDetail({ product }: ProductProps) {
  const router = useRouter();
  const price = convertToDisplayPrice(product.price);
  const [cartIdCookie] = useState(Cookies.get("cart") || undefined);
  const [cart, setCart] = useState<CartResponse | undefined>();

  const getAndSetCart = useCallback(async () => {
    if (cartIdCookie) {
      const cartResponse = await getCart(cartIdCookie);
      setCart(cartResponse);
    }
  }, [cartIdCookie, getCart]);

  useEffect(() => {
    getAndSetCart();
  }, [getAndSetCart]);

  useEffect(() => {
    if (cartIdCookie === undefined) {
      Cookies.remove("cart");
    } else {
      Cookies.set("cart", cartIdCookie);
    }
  }, [cartIdCookie]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  async function addItemToCart(e: React.MouseEvent) {
    //TODO: When item is already in cart, and user clicks to add to cart again, the quantity is incremented.
    if (cartIdCookie === undefined) {
      const cart = await postCart({ products: [product], quantity: 1 });
      Cookies.set("cart", cart.sessionId);
    } else {
      await patchCart(cartIdCookie, {
        products: [product],
        quantity: 1,
      });
    }
  }

  return (
    <div className="container">
      <Head>
        <title>{product.name} | Styles by Santeena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <Container maxWidth="lg">
          <Grid
            item
            container
            gap={4}
            paddingY={3}
            direction="row"
            justifyContent=""
          >
            <Grid item xs={7}>
              <Image
                layout="responsive"
                width="320"
                height="400"
                src={product.imageUrl}
                alt={product.description}
              />
            </Grid>
            <Grid item xs={4} marginTop={20}>
              <Typography variant="h3">{product.name}</Typography>
              <Typography variant="h5" marginBottom={4}>
                £{price}
              </Typography>
              <Divider />
              <Typography variant="body1" marginY={4}>
                {product.description}
              </Typography>
              <Button onClick={(e) => addItemToCart(e)} variant="contained">
                Add to cart - £{price}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
