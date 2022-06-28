import { useContext, useState } from "react";

import Cookies from "js-cookie";
import { Button, Container, Divider, Grid, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useMutation, useQuery } from "react-query";

import {
  CartResponse,
  getCart,
  patchCart,
  postCart,
} from "../../src/carts/api";
import {
  CartActionType,
  CartDispatchContext,
} from "../../src/carts/cartContext";
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
  const cartDispatch = useContext(CartDispatchContext);
  const [isCartUpdated, setIsCartUpdated] = useState(false);
  const [tempCart, setTempCart] = useState<CartResponse | undefined>();

  const { data: product } = useQuery(["product", params.id], () =>
    getProduct(params.id)
  );
  const { mutate: createCart } = useMutation(
    ({ data }: any) => postCart(data),
    {
      onError: () => {
        console.log("error with creating cart");
      },
      onSuccess: (cart) => {
        console.log("success with creating cart");
        Cookies.set("cart", cart.sessionId);
        setIsCartUpdated(true);
        setTempCart(cart);
      },
    }
  );
  const { mutate: updateCart } = useMutation(
    ({ id, data }: any) => patchCart(id, data),
    {
      onError: () => {
        console.log("error with updating cart");
      },
      onSuccess: (cart) => {
        console.log("success with updating cart");
        setIsCartUpdated(true);
        setTempCart(cart);
      },
    }
  );
  useQuery(
    ["cart", tempCart?.sessionId],
    () => getCart(tempCart?.sessionId as string),
    {
      enabled: isCartUpdated && !!tempCart,
      onError: () => {
        console.log("error: cart no refreshed");
      },
      onSuccess: (cart) => {
        console.log("fetched new cart after update");
        cartDispatch?.({ type: CartActionType.UPDATE, payload: cart });
        setIsCartUpdated(false);
        setTempCart(undefined);
      },
    }
  );

  const router = useRouter();
  const price = convertToDisplayPrice(product?.price || 0);

  async function addItemToCart(e: React.MouseEvent, product?: Product) {
    //TODO: When item is already in cart, and user clicks to add to cart again, the quantity is incremented.
    if (Cookies.get("cart") === undefined) {
      createCart({
        data: {
          products: [product],
          quantity: 1,
        },
      });
    } else {
      updateCart({
        id: Cookies.get("cart") as string,
        data: {
          products: [product],
          quantity: 1,
        },
      });
    }
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
