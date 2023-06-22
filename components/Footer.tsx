import Image from "next/image";
import logo from "../assets/images/logo-text-bw.png";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="skull logo" />
      </div>
    </footer>
  );
}
