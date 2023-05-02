import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DropdownMenu from "../DropdownMenu";
import styles from "../../styles/ProductCard.module.css";
import { db } from "../../utils/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import getVariantDetails from "../../pages/api/printful/variants/[id]";

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/"
    : "https://pdku.show/api/";

export default function ProductCard({ product, index }: ProductCardProps) {
  const { image, name, price, variants } = product;
  const formattedPrice = Math.ceil(Number(price));
  const [productSizes, setProductSizes] = useState<string[]>();
  const [productColors, setProductColors] = useState<string[][]>();
  const [previewImage, setPreviewImage] = useState(image);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

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
      setProductColors(colorNamesAndCodes);
    });
  }, [variants]);

  useEffect(() => {
    if (selectedColor !== "") {
      variants.forEach((variant) => {
        if (variant.color === selectedColor) {
          setPreviewImage(variant.images[0]);
        }
      });
    }
  }, [selectedColor, variants]);

  // useEffect(() => {
  //   if (productSizes !== undefined && productSizes.length <= 1) {

  //   }
  // }, [productSizes]);

  function handleColorSection(color: string) {
    if (selectedColor === color) {
      setSelectedColor("");
    } else {
      setSelectedColor(color);
    }
  }

  function handleSizeSection(size: string) {
    if (selectedSize === size) {
      setSelectedSize("");
    } else {
      setSelectedSize(size);
    }
  }

  function handleAddToCart() {
    variants.forEach((variant) => {
      const { color, size } = variant;
      //@ts-ignore
      if (productSizes.length > 1 && productColors.length > 1) {
        if (color === selectedColor && size === selectedSize) {
          console.log(variant.stripePriceId);
        }
      }
      //@ts-ignore
      if (productSizes.length <= 1 && productColors.length > 1) {
        if (color === selectedColor) {
          console.log(variant.stripePriceId);
        }
      }
      //@ts-ignore
      if (productSizes.length > 1 && productColors.length <= 1) {
        if (size === selectedSize) {
          console.log(variant.stripePriceId);
        }
      }
      //@ts-ignore
      if (productSizes.length <= 1 && productColors.length <= 1) {
        console.log(variant.stripePriceId);
      }
    });
    setSelectedColor("");
    setSelectedSize("");
  }

  return (
    <div className={styles.card}>
      <Image
        src={previewImage}
        className={styles.image}
        alt={name}
        // width={300}
        // height={300}
        fill
        sizes="(max-width: 768px) 100vw"
        priority={index <= 6}
      />
      <div className={styles.detailsContainer}>
        <div className={styles.name}>{name}</div>
        <div className={styles.colorSelectionContainer}>
          {productColors && productColors.length > 1 ? (
            productColors.map((color, i) => {
              return (
                <div
                  key={i}
                  style={{ backgroundColor: `${color[1]}` }}
                  className={
                    color[0] === selectedColor
                      ? `${styles.colorSelector} ${styles.selected}`
                      : `${styles.colorSelector}`
                  }
                  title={color[0]}
                  onClick={() => handleColorSection(color[0])}
                ></div>
              );
            })
          ) : (
            <div className={styles.colorPlaceholder}></div>
          )}
        </div>
        <div className={styles.sizeSelectionContainer}>
          {productSizes &&
            productSizes.length > 1 &&
            productSizes.map((size, i) => {
              return (
                <div
                  key={i}
                  className={
                    size === selectedSize
                      ? `${styles.sizeSelector} ${styles.selected}`
                      : `${styles.sizeSelector}`
                  }
                  onClick={() => handleSizeSection(size)}
                >
                  {size}
                </div>
              );
            })}
        </div>
        <div className={styles.priceContainer}>
          <div className={styles.price}>${formattedPrice}</div>
          <button onClick={handleAddToCart} className={styles.buyButton}>
            add to cart
          </button>
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
