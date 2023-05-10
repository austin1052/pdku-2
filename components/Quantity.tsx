import { CartContext } from "../context/CartContext";
import { SetStateAction, useState, useContext } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import styles from "../styles/cart/LineItem.module.css";

const functions = getFunctions();
const updateItemQuantity = httpsCallable(functions, "updateItemQuantity");

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
    const updatedQuantity = quantity + newQuantity;
    const currentItem = lineItems?.find((item) => item.variantId === id);
    const updatedItem = { ...currentItem, quantity: updatedQuantity };
    const localToken = localStorage.getItem("token");
    await updateItemQuantity({
      token: localToken,
      updatedItem,
    });
    setIsLoading(false);
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
