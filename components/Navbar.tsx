import { useState, useEffect } from "react";
import { RiShoppingBagLine as CartIcon } from "react-icons/ri";
import { IconContext } from "react-icons";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const [cartQuantity, setCartQuantity] = useState(0);

  // useEffect(() => {
  //   window.addEventListener("storage", () => {
  //     console.log("STORAGE");
  //     setCartQuantity(cartQuantity);
  //   });
  // }, [cartQuantity]);

  console.log(cartQuantity);

  function updateCartQuantity() {
    let cart = localStorage.getItem("cart");
    const parsedCart = typeof cart === "string" ? JSON.parse(cart) : [];
    const itemSum = parsedCart.reduce((acc: number, cur: CartItem) => {
      return acc + cur.quantity;
    }, 0);
    console.log("STORAGE");
    setCartQuantity(itemSum);
  }

  useEffect(() => {
    updateCartQuantity();
    window.addEventListener("storage", () => {
      updateCartQuantity();
    });
  }, []);

  return (
    <div className={styles.topNav}>
      <div className={styles.cartIconContainer}>
        <IconContext.Provider value={{ className: styles.cartIcon }}>
          <CartIcon />
        </IconContext.Provider>
        <div className={styles.cartQuantity}>{cartQuantity}</div>
      </div>
    </div>
  );
}
