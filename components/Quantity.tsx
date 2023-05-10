import { CartContext } from "../context/CartContext";
import { SetStateAction, useState, useContext } from "react";
import { updateItemQuantity } from "../utils/firebase/cart";
import styles from "../styles/cart/LineItem.module.css";

interface Props {
  quantity: number;
  setItemQuantity: React.Dispatch<SetStateAction<number>>;
  id: string;
}

export default function Quantity({ quantity, setItemQuantity, id }: Props) {
  const { lineItems, setIsLoading } = useContext(CartContext);

  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleQuantityChange = (newQuantity: number) => {
    setIsLoading(true);
    setItemQuantity((prev) => {
      return prev + newQuantity;
    });
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      updateQuantity(newQuantity);
    }, 1000);
    setTimeoutId(id);
  };

  async function updateQuantity(newQuantity: number) {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const updatedQuantity = quantity + newQuantity;
      const currentItem = lineItems?.find((item) => item.variantId === id);
      if (currentItem) {
        const updatedItem = { ...currentItem, quantity: updatedQuantity };
        await updateItemQuantity(localToken, updatedItem);
        setIsLoading(false);
        window.dispatchEvent(new Event("updateCart"));
      }
    }
  }

  return (
    <div className={styles.quantityContainer}>
      <div
        className={styles.quantityDecrease}
        onClick={() => handleQuantityChange(-1)}
      >
        -
      </div>
      <div className={styles.quantity}>{quantity}</div>
      <div
        className={styles.quantityIncrease}
        onClick={() => handleQuantityChange(1)}
      >
        +
      </div>
    </div>
  );
}
