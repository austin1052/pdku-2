import { useState, useEffect } from "react";
import Link from "next/link";
import { BsBag } from "react-icons/bs";
import { IconContext } from "react-icons";
import styles from "../styles/Navbar.module.css";
import { getCartFromFirebase } from "../utils/firebase/cart";

export default function Navbar() {
  const [cartQuantity, setCartQuantity] = useState(0);

  // function updateCartQuantity() {
  //   let cart = localStorage.getItem("cart");
  //   const parsedCart = typeof cart === "string" ? JSON.parse(cart) : [];
  //   const itemSum = parsedCart.reduce((acc: number, cur: CartItem) => {
  //     return acc + cur.quantity;
  //   }, 0);
  //   setCartQuantity(itemSum);
  // }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      getCartQuantityFromFirebase(token);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("addCartItem", () => {
      const token = localStorage.getItem("token");
      if (token !== null) {
        getCartQuantityFromFirebase(token);
      }
    });
  }, []);

  async function getCartQuantityFromFirebase(token: string) {
    const cart = await getCartFromFirebase(token);
    const itemSum = cart.reduce((acc: number, cur: CartItem) => {
      return acc + cur.quantity;
    }, 0);
    setCartQuantity(itemSum);
  }

  return (
    <div className={styles.topNav}>
      <Link href="/merch/cart" className={styles.cartIconContainer}>
        <IconContext.Provider value={{ className: styles.cartIcon }}>
          {/* <CartIcon /> */}
          <BsBag />
        </IconContext.Provider>
        <div className={styles.cartQuantity}>{cartQuantity}</div>
      </Link>
    </div>
  );
}
