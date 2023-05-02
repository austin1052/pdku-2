import { useEffect } from "react";

export default function Cart() {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  function createCheckoutSession() {}

  return (
    // <form action="/api/create-checkout-session" method="POST">
    <button onClick={createCheckoutSession} role="link">
      Checkout
    </button>
  );
}
