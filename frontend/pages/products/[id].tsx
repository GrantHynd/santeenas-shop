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
    <>
      <Head>
        <title>{`${product?.name} | Styles by Santeena`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container mx-auto max-w-screen-lg my-12">
          <div className="flex flex-wrap space-x-4 lg:space-x-12">
            <div className="flex-auto sm:max-w-sm">
              <Image
                sizes="100vw"
                width="670"
                height="830"
                src={product?.imageUrl || ""}
                alt={product?.description as string}
              />
            </div>
            <div className="flex-1 min-w-64">
              <>
                <h1 className="text-xl">{product?.name}</h1>
                <p className="text-base">£{price}</p>
                <hr />
              </>
              <div className="mt-4 space-y-4">
                <p className="text-base">{product?.description}</p>
                <button
                  onClick={() => createOrUpdateCart(product?.id as string, 1)}
                  className="btn btn-primary text-align-right"
                >
                  Add to cart - £{price}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
