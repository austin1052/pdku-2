import { useState, useEffect, createContext, SetStateAction } from "react";
import { getCartFromFirebase } from "../utils/firebase/cart";

export const CartContext = createContext<CartContextValue>(
  {} as CartContextValue
);

interface CartContextValue {
  lineItems?: CartItem[];
  setLineItems: React.Dispatch<SetStateAction<CartItem[] | undefined>>;
  shippingAddress?: ShippingAddress;
  setShippingAddress: React.Dispatch<
    SetStateAction<ShippingAddress | undefined>
  >;
  getShippingCost: (recipient: ShippingAddress) => Promise<void>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}

export function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lineItems, setLineItems] = useState<CartItem[]>();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   // get cart from firebase
  //   async function getCart() {
  //     setIsLoading(true);
  //     await new Promise((resolve) => setTimeout(resolve, 2000));

  //     const token = localStorage.getItem("token");
  //     if (token !== null) {
  //       const cart = await getCartFromFirebase(token);
  //       setLineItems(cart);
  //     }
  //     setIsLoading(false);
  //   }
  //   getCart();
  // }, []);

  async function getShippingCost(recipient: ShippingAddress) {
    const items = lineItems?.map((item) => {
      return {
        quantity: item.quantity,
        variant_id: item.catalogId,
      };
    });

    const shippingData = { recipient, items };

    const response = await fetch("/api/printful/shipping", {
      method: "POST",
      body: JSON.stringify(shippingData),
    });
    const shippingCost = await response.json();
  }

  return (
    <CartContext.Provider
      value={{
        shippingAddress,
        setShippingAddress,
        lineItems,
        setLineItems,
        getShippingCost,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
