import { Alert, AlertTitle, Container, LinearProgress } from "@mui/material";
import { dehydrate, QueryClient, useQuery } from "react-query";
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

  return (
    <>
      {isLoading && <LinearProgress color="secondary" />}
      <Container>
        {isErrorOrEmptyResponse && (
          <div style={{ marginTop: 40 }}>
            <Alert severity="error">
              <AlertTitle>Issue with checkout</AlertTitle>
              <p>
                Looks like something went wrong, please reach out to us and we
                can confirm whether your order went through.
              </p>
            </Alert>
          </div>
        )}
        {data?.session && (
          <div style={{ marginTop: 40 }}>
            <Alert severity="success">
              <AlertTitle>Order placed</AlertTitle>
              <p>Thank you for supporting your local girl!</p>
              <p>
                We will send your receipt to{" "}
                <strong>{data.customer.email}</strong>, and get started on your
                putting your order together.
              </p>
            </Alert>
          </div>
        )}
      </Container>
    </>
  );
}
