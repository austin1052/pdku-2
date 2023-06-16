import { useState, useEffect, useContext } from "react";
import { MobileContext } from "../context/MobileContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsBag as CartIcon } from "react-icons/bs";
import { RiMenu5Fill as MapIcon } from "react-icons/ri";
import { IconContext } from "react-icons";
import styles from "../styles/Navbar.module.css";
import { getCartFromFirebase } from "../utils/firebase/cart";

export default function Navbar() {
  const [cartQuantity, setCartQuantity] = useState(0);

  const isMobile = useContext(MobileContext);
  console.log(isMobile);

  const router = useRouter();
  const route = router.route;

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
      {route === "/" ? (
        <>
          <div></div>
          <Link href="/merch">
            <div className={styles.merchLink}>
              {isMobile ? (
                <MapIcon className={styles.mapIcon} />
              ) : (
                "ask me about my D&D campaign"
              )}
            </div>
          </Link>
          {/* <div className={styles.merchLink}>about</div> */}
        </>
      ) : // <h1 className={`${styles.title} ${styles.titleMain}`}>
      //   <span>Please</span> <span>Don&apos;t</span> <span>Kill</span>{" "}
      //   <span>Us</span>
      // </h1>
      route === "/merch/cart" ? (
        <Link href="/merch">back</Link>
      ) : route === "/merch" ? (
        <>
          <h1 className={`${styles.title} ${`hello bold green`}`}>
            <Link href="/">PDKU</Link>
          </h1>
          <Link href="/merch/cart" className={styles.cartIconContainer}>
            <IconContext.Provider value={{ className: styles.cartIcon }}>
              <CartIcon />
            </IconContext.Provider>
            <div className={styles.cartQuantity}>{cartQuantity}</div>
          </Link>
        </>
      ) : (
        <h1 className={styles.title}>
          <Link href="/">PDKU</Link>
        </h1>
      )}
      {/* <Link href="/merch/cart" className={styles.cartIconContainer}>
        <IconContext.Provider value={{ className: styles.cartIcon }}>
          <CartIcon />
        </IconContext.Provider>
        <div className={styles.cartQuantity}>{cartQuantity}</div>
      </Link> */}
    </div>
  );
}
