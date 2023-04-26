import { useState, useEffect } from "react";
import Image from "next/image";
import DropdownMenu from "../DropdownMenu";
import styles from "../../styles/ProductCard.module.css";

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/"
    : "https://pdku.show/api/";

export default function ProductCard({ product }: any) {
  const { id, image, name, price } = product;
  return (
    <div className={styles.card}>
      {/* <div className={styles.imageContainer}> */}
      <Image src={image} className={styles.image} alt={name} fill></Image>
      {/* </div> */}
      <div className={styles.name}>{name}</div>
      <div className={styles.proce}>{price}</div>
      <button>add to cart</button>
    </div>
  );
}
