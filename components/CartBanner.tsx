import Image from "next/image";
import Link from "next/link";
import { AiFillCloseCircle as CloseIcon } from "react-icons/ai";
import { IconContext } from "react-icons";
import styles from "../styles/cart/CartBanner.module.css";
import navStyles from "../styles/Navbar.module.css";
import { SetStateAction } from "react";

interface CartBannerProps {
  product: ProductVariant | undefined;
  setShowCartBanner: React.Dispatch<SetStateAction<boolean>>;
}

export default function CartBanner({
  product,
  setShowCartBanner,
}: CartBannerProps) {
  function handleCheckout() {}

  return (
    <div className={styles.bannerContainer}>
      <div
        className={styles.closeBannerButton}
        role="button"
        onClick={() => setShowCartBanner(false)}
      >
        <IconContext.Provider value={{ className: styles.closeBannerIcon }}>
          <CloseIcon />
        </IconContext.Provider>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src={product?.images[0] || ""}
          className={styles.image}
          alt={product?.variantName || ""}
          fill
          sizes="(max-width: 768px) 100vw"
        ></Image>
      </div>
      <div className={styles.infoContainer}>
        <div>
          <div className={styles.alert}>Item added to cart</div>
          <div className={styles.productName}>{product?.variantName}</div>
        </div>
        <Link href="/merch/cart">
          <div className={styles.checkoutButton} onClick={handleCheckout}>
            checkout
          </div>
        </Link>
      </div>
    </div>
  );
}
