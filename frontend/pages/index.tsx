import Head from "next/head";
import Image from "next/image";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { getProducts, Product } from "../lib/products";

export async function getStaticProps() {
  return {
    props: { products: await getProducts() },
    revalidate: 60,
  };
}

type ProductProps = {
  products: Product[];
};

export default function Home({ products }: ProductProps) {
  return (
    <div className="container">
      <Head>
        <title>Nails by Santeena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Grid
          item
          container
          xs={12}
          direction="column"
          alignContent="center"
          bgcolor="primary.main"
          padding={10}
          spacing={2}
        >
          <Typography variant="h3" color="#fff">
            Santeena's Shop
          </Typography>
          <Typography variant="body1" color="#fff">
            customise your look
          </Typography>
        </Grid>
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
                <Image
                  layout="responsive"
                  width="320"
                  height="400"
                  src={product.imageUrl}
                  alt={product.description}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
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
