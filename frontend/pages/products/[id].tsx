import { Button, Container, Divider, Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { getProduct, getProducts, Product } from "../../src/products/api";
import { convertToDisplayPrice } from "../../src/products/utils";
import { useCart } from "../../src/carts/useCart";

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
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["product", params.id], () =>
    getProduct(params.id)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      params,
    },
  };
}

type ProductProps = {
  params: StaticProps["params"];
};

export default function ProductDetail({ params }: ProductProps) {
  const router = useRouter();
  const { createOrUpdateCart } = useCart(Cookies.get("cart"));
  const { data: product } = useQuery(["product", params.id], () =>
    getProduct(params.id)
  );
  const price = convertToDisplayPrice(product?.price || 0);

  async function addItemToCart(e: React.MouseEvent, product?: Product) {
    createOrUpdateCart(product as Product);
  }

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container">
      <Head>
        <title>{product?.name} | Styles by Santeena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
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
                src={product?.imageUrl || ""}
                alt={product?.description}
              />
            </Grid>
            <Grid item xs={4} marginTop={20}>
              <Typography variant="h3">{product?.name}</Typography>
              <Typography variant="h5" marginBottom={4}>
                £{price}
              </Typography>
              <Divider />
              <Typography variant="body1" marginY={4}>
                {product?.description}
              </Typography>
              <Button
                onClick={(e) => addItemToCart(e, product)}
                variant="contained"
              >
                Add to cart - £{price}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
