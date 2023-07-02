import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { dehydrate, QueryClient, useQuery } from "react-query";

import { useUpdateCart } from "../src/carts/hooks/useUpdateCart";
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
  const { createOrUpdateCart } = useUpdateCart();
  const { data: products } = useQuery("products", getProducts);

  return (
    <>
      <Head>
        <title>Products | Styles by Santeena</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-12">
            {products?.map((product) => {
              return (
                <div key={product.id} className="card bg-base-100 shadow-xl">
                  <Link href={`/products/${product.id}`}>
                    <Image
                      sizes="100vw"
                      width="320"
                      height="400"
                      src={product.imageUrl}
                      alt={product.description}
                      className="w-full h-auto"
                    />
                  </Link>
                  <div className="card-body">
                    <Link href={`/products/${product.id}`}>
                      <h4 className="card-title">{product.name}</h4>
                    </Link>
                    <p>{product.description}</p>
                    <div className="card-actions justify-end">
                      <button
                        onClick={() =>
                          createOrUpdateCart(product?.id as string, 1)
                        }
                        className="btn"
                      >
                        Add to cart - £{convertToDisplayPrice(product.price)}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
