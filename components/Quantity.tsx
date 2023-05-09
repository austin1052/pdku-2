import styles from "../styles/cart/LineItem.module.css";

interface Props {
  quantity: number;
}

export default function Quantity({ quantity }: Props) {
  return (
    <div className={styles.quantityContainer}>
      <div className={styles.quantityDecrease}>-</div>
      <div className={styles.quantity}>{quantity}</div>
      <div className={styles.quantityIncrease}>+</div>
    </div>
  );
}
