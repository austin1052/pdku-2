import { useState, useEffect } from "react";
import Link from "next/link";
import { BsBag as CartIcon } from "react-icons/bs";
import { IconContext } from "react-icons";
import styles from "../styles/Navbar.module.css";
import { getCartFromFirebase } from "../utils/firebase/cart";

export default function Navbar() {
  const [cartQuantity, setCartQuantity] = useState(0);

  const pageTitle = "Merch";
  const pageTitleLink = "/merch";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      getCartQuantityFromFirebase(token);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("updateCart", () => {
      const token = localStorage.getItem("token");
      if (token !== null) {
        getCartQuantityFromFirebase(token);
      }
    });
  }, []);

  async function getCartQuantityFromFirebase(token: string) {
    const cart = await getCartFromFirebase(token);
    if (cart !== undefined) {
      const itemSum = cart.reduce((acc: number, cur: CartItem) => {
        return acc + cur.quantity;
      }, 0);
      setCartQuantity(itemSum);
    }
  }

  return (
    <div className={styles.topNav}>
      {/* <div className={styles.siteName}>
        <Link href={pageTitleLink}>
          <h3>Merch</h3>
        </Link>
      </div> */}
      <Link href="/merch/cart" className={styles.cartIconContainer}>
        <IconContext.Provider value={{ className: styles.cartIcon }}>
          {/* <CartIcon /> */}
          <CartIcon />
        </IconContext.Provider>
        <div className={styles.cartQuantity}>{cartQuantity}</div>
      </Link>
    </div>
  );
}
