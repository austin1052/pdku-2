import Image from "next/image";
import logo from "../assets/images/logo-text-primary.png";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="skull logo" />
      </div>
      {/* <div>About</div>
      <div>Campaigns</div>
      <div>Merch</div> */}
    </footer>
  );
}
