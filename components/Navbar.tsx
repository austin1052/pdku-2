import { RiShoppingCart2Line as CartIcon } from "react-icons/ri";
import { RiShoppingBagLine } from "react-icons/ri";
import { IconContext } from "react-icons";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  return (
    <div className={styles.topNav}>
      <IconContext.Provider value={{ className: styles.cartIcon }}>
        <RiShoppingBagLine />
      </IconContext.Provider>
    </div>
  );
}
