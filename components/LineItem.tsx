import Image from "next/image";
import { AiFillCloseCircle as CloseIcon } from "react-icons/ai";
import { IconContext } from "react-icons";
import Quantity from "../components/Quantity";
import styles from "../styles/cart/LineItem.module.css";

interface LineItemProps {
  item: CartItem;
}

export default function LineItem({ item }: LineItemProps) {
  const { name, price, stripePriceId, quantity, image } = item;

  const totalItemCost = (item.quantity * Number(item.price)).toFixed(2);

  return (
    <div className={styles.lineItem}>
      <div role="button">
        <IconContext.Provider value={{ className: styles.removeItemButton }}>
          <CloseIcon />
        </IconContext.Provider>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src={image}
          className={styles.image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          priority
        />
      </div>
      <div className={styles.itemDetails}>
        <div>
          <div className={styles.itemPrice}>{name}</div>
          <div>${price}</div>
          <Quantity quantity={quantity} />
        </div>
        <div className={styles.itemPrice}>${totalItemCost}</div>
      </div>
    </div>
  );
}
