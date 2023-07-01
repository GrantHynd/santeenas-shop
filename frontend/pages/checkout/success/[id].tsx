import { dehydrate, QueryClient, useQuery } from "react-query";
import { LoadingSpinner } from "../../../src/app/components/LoadingSpinner";
import { getCheckoutSession } from "../../../src/carts/api";

type ServerProps = {
  params: {
    id: string;
  };
};

export async function getServerSideProps({ params }: ServerProps) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["checkout", params.id], () =>
    getCheckoutSession(params.id)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      params,
    },
  };
}

type CheckoutSuccessProps = {
  params: ServerProps["params"];
};

export default function CheckoutSuccessDetail({
  params,
}: CheckoutSuccessProps) {
  const { data, isFetched, isLoading, isError } = useQuery(
    ["product", params.id],
    () => getCheckoutSession(params.id)
  );

  const isErrorOrEmptyResponse = (isFetched && !data) || isError;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 md:px-8">
      {isErrorOrEmptyResponse && (
        <div className="p-8 my-8 border-2">
          <p>
            Looks like something went wrong, please reach out to us and we can
            confirm whether your order went through.
          </p>
        </div>
      )}
      {data?.session && (
        <div className="p-8 my-8 border-2">
          <p>Thank you for supporting your local girl!</p>
          <p>
            We will send your receipt to <strong>{data.customer.email}</strong>,
            and get started on your putting your order together.
          </p>
        </div>
      )}
    </div>
  );
}
