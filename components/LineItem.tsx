import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import Image from "next/image";
import { AiFillCloseCircle as CloseIcon } from "react-icons/ai";
import { IconContext } from "react-icons";
import Quantity from "../components/Quantity";
import styles from "../styles/cart/LineItem.module.css";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const removeFromCart = httpsCallable(functions, "removeFromCart");

interface LineItemProps {
  item: CartItem;
}

export default function LineItem({ item }: LineItemProps) {
  const { name, price, stripePriceId, quantity, image, variantId } = item;
  const [lineItemStyle, setLineItemStyle] = useState(`${styles.lineItem}`);
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const { setLineItems, setIsLoading } = useContext(CartContext);

  const totalItemCost = (item.quantity * Number(item.price)).toFixed(2);

  async function handleRemove(event: any) {
    const localToken = localStorage.getItem("token");
    setIsLoading(true);
    setLineItemStyle(`${styles.lineItem} ${styles.removed}`);
    const res = await removeFromCart({
      token: localToken,
      removedProduct: item,
    });
    const data = res.data as RemoveFromCartResponse;
    // wait for trainsition delay on lineItem to finish before setting new items
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    setLineItems(data.lineItems);
  }

  useEffect(() => {
    setLineItems((items) => {
      if (!items) return [];
      const updatedItems = items.map((item) => {
        if (item.variantId === variantId) {
          return { ...item, quantity: itemQuantity };
        } else {
          return item;
        }
      });
      return updatedItems;
    });
  }, [itemQuantity, setLineItems, variantId]);

  return (
    <div className={lineItemStyle}>
      <div role="button" onClick={handleRemove}>
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
          <Quantity
            quantity={itemQuantity}
            setItemQuantity={setItemQuantity}
            id={variantId}
          />
        </div>
        <div className={styles.itemPrice}>${totalItemCost}</div>
      </div>
    </div>
  );
}
