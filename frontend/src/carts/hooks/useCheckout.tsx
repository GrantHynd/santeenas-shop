import { useMutation } from "react-query";
import {
  CheckoutSessionBody,
  CheckoutSessionResponse,
  postCheckoutSessions,
} from "../api";

export default function useCheckout() {
  const { mutate: checkout } = useMutation(
    (checkoutData: CheckoutSessionBody) => postCheckoutSessions(checkoutData),
    {
      onError: () => {
        console.log("error with creating checkout session");
      },
      onSuccess: ({ checkoutUrl }: CheckoutSessionResponse) => {
        window.location.href = checkoutUrl;
      },
    }
  );
  return { checkout };
}
