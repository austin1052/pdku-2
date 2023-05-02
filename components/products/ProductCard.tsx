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

export default function ProductCard({ product, index }: ProductCardProps) {
  const { image, name, price, variants } = product;
  const formattedPrice = Math.ceil(Number(price));
  const [showOptions, setShowOptions] = useState(false);
  const [productSizes, setProductSizes] = useState<string[]>();
  const [productColors, setProductColors] = useState<string[][]>();

  // if only one color or one size,

  // set colors and sizes when buy is clicked
  // loop through variants
  // create array of colors, array of sizes, remove duplicates
  useEffect(() => {
    const sizes: string[] = [];
    variants.forEach((variant: ProductVariant) => {
      if (variant.size !== "") sizes.push(variant.size);
    });
    const uniqueSizes: Set<string> = new Set(sizes);
    setProductSizes([...uniqueSizes]);

    const colorNamesAndCodes: string[][] = [];
    const colorNames: string[] = [];
    variants.forEach((variant: ProductVariant) => {
      if (!colorNames.includes(variant.color)) {
        colorNames.push(variant.color);
        colorNamesAndCodes.push([variant.color, variant.colorCode]);
      }
      // const uniqueColors: Set<string[]> = new Set(colors);
      setProductColors(colorNamesAndCodes);
    });
  }, [variants]);

  return (
    <div className={styles.card}>
      {/* <div className={styles.imageContainer}> */}
      <Image
        src={image}
        className={styles.image}
        alt={name}
        // width={300}
        // height={300}
        fill
        sizes="(max-width: 768px) 100vw"
        priority={index <= 6}
      />
      {/* </div> */}
      <div className={styles.detailsContainer}>
        <div className={styles.name}>{name}</div>
        <div className={styles.colorSelectionContainer}>
          {showOptions &&
            productColors &&
            productColors.map((color, i) => {
              return (
                <div
                  key={i}
                  style={{ backgroundColor: "red" }}
                  className={styles.colorBox}
                ></div>
              );
            })}
        </div>
        <div className={styles.priceContainer}>
          <div className={styles.price}>${formattedPrice}</div>
          {showOptions ? (
            <>
              <button className={styles.buyButton}>add to cart</button>
            </>
          ) : (
            <button
              onClick={() => setShowOptions(true)}
              className={styles.buyButton}
            >
              buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  index: number;
}

interface Colors {
  color: string;
  colorCode: string;
}
