import { Container, Divider, Grid, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { getProduct, getProducts } from "../../src/products/api";
import { convertToDisplayPrice } from "../../src/products/utils";
import { useUpdateCart } from "../../src/carts/hooks/useUpdateCart";

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
  const { createOrUpdateCart } = useUpdateCart();
  const { data: product } = useQuery(["product", params.id], () =>
    getProduct(params.id)
  );
  const price = convertToDisplayPrice(product?.price || 0);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container">
      <Head>
        <title>{`${product?.name} | Styles by Santeena`}</title>
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
                sizes="100vw"
                width="670"
                height="830"
                src={product?.imageUrl || ""}
                alt={product?.description as string}
                className="w-full h-auto"
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
              <button
                onClick={() => createOrUpdateCart(product?.id as string, 1)}
                className="btn btn-sm"
              >
                Add to cart - £{price}
              </button>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
