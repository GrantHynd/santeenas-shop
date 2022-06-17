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
import { getProducts, Product } from "../lib/products";
import { Header } from "../components/app/header";

export async function getStaticProps() {
  return {
    props: { products: await getProducts() },
    revalidate: 60,
  };
}

type ProductsProps = {
  products: Product[];
};

export default function Products({ products }: ProductsProps) {
  return (
    <div className="container">
      <Head>
        <title>Products | Styles by Santeena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <Grid
          item
          container
          gap={4}
          paddingX={8}
          marginY={4}
          direction="row"
          justifyContent=""
        >
          {products.map((product) => {
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
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    £{product.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Add to cart</Button>
                </CardActions>
              </Card>
            );
          })}
        </Grid>
      </main>
    </div>
  );
}
