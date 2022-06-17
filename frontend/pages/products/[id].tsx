import { Button, Container, Divider, Grid, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Header } from "../../src/app/components/Header";
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

  if (router.isFallback) {
    return <div>Loading...</div>;
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
              <Button variant="contained">Add to cart - £{price}</Button>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
