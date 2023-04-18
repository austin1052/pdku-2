import { useState, useEffect } from "react";
import Image from "next/image";
import DropdownMenu from "../DropdownMenu";
import styles from "../../styles/ProductCard.module.css";

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/"
    : "https://pdku.show/api/";

export default function ProductCard({ product }: any) {
  const [stripePriceId, setStripePriceId] = useState();
  const [selectedVariantId, setSelectedVariantId] = useState();
  const [productVariantData, setProductVariantData] = useState();
  const { id, name, thumbnail_url } = product;
  const formatedId = id.toString();

  // get variant data
  // set selected variant from dropdowns for color/size
  // initial selected variant will be first variant in list
  // display price from selected variant
  // console.log(productVariantData);

  useEffect(() => {
    async function getVariantData() {
      const response = await fetch(`${apiURL}/products/printful/${id}`);
      const productVariants = await response.json();
      console.log(productVariants);
      setProductVariantData(productVariants);
    }
    getVariantData();
    // console.log(variantData);
  }, [id]);

  // useEffect(() => {
  //   async function getStripePriceId() {
  //     const response = await fetch(`${apiURL}/products/stripe/${formatedId}`);
  //     const product = await response.json();
  //     console.log(product);
  //   }
  //   getStripePriceId();
  // }, [formatedId]);

  return (
    <div className={styles.card}>
      <Image
        src={thumbnail_url}
        className={styles.image}
        alt={name}
        fill
      ></Image>
      <div className={styles.name}>{name}</div>
      {productVariantData && (
        <DropdownMenu productVariantData={productVariantData} />
      )}
      <button>add to cart</button>
    </div>
  );
}
