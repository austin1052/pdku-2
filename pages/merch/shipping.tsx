import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AddressElement } from "@stripe/react-stripe-js";

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Shipping() {
  return (
    <Elements stripe={stripe}>
      <form>
        <h3>Shipping</h3>
        <AddressElement options={{ mode: "shipping" }} />
      </form>
    </Elements>
  );
}
