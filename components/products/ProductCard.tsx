import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DropdownMenu from "../DropdownMenu";
import styles from "../../styles/ProductCard.module.css";
import { db } from "../../utils/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/"
    : "https://pdku.show/api/";

// click
// request

// async function getVariants(id: string) {
//   const variantsRef = collection(db, "products", id, "variants");
//   const variantData = await getDocs(variantsRef);
//   variantData.forEach((variant) => {
//     console.log(variant.data());
//   });
// }

export default function ProductCard({ product }: any) {
  const { id, image, name, price } = product;
  const formattedPrice = Math.ceil(Number(price));

  return (
    <div className={styles.card}>
      {/* <div className={styles.imageContainer}> */}
      <Image src={image} className={styles.image} alt={name} fill></Image>
      {/* </div> */}
      <div className={styles.detailsContainer}>
        <div className={styles.name}>{name}</div>
        <div className={styles.priceContainer}>
          <div className={styles.price}>${formattedPrice}</div>
          <Link href="" className={styles.buyButton}>
            buy
          </Link>
        </div>
      </div>
    </div>
  );
}
