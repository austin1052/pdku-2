import { useState, useEffect, SetStateAction } from "react";
import Button from "../Button";
import Image from "next/image";
import styles from "../../styles/ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  index: number;
  addItemToCart: any;
}

export default function ProductCard({
  product,
  index,
  addItemToCart,
}: ProductCardProps) {
  const { image, name, price, variants } = product;
  const formattedPrice = Math.ceil(Number(price));
  const [productSizes, setProductSizes] = useState<string[]>();
  const [productColors, setProductColors] = useState<string[][]>();
  const [previewImage, setPreviewImage] = useState(image);
  const [selectedColor, setSelectedColor] = useState(product.variants[0].color);
  const [selectedSize, setSelectedSize] = useState("");

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
    });
    setProductColors(colorNamesAndCodes);
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
          addItemToCart(variant);
        }
      }
      //@ts-ignore
      if (productSizes.length <= 1 && productColors.length > 1) {
        if (color === selectedColor) {
          addItemToCart(variant);
        }
      }
      //@ts-ignore
      if (productSizes.length > 1 && productColors.length <= 1) {
        if (size === selectedSize) {
          addItemToCart(variant);
        }
      }
      // @ts-ignore
      if (productSizes.length <= 1 && productColors.length <= 1) {
        addItemToCart(variant);
      }
    });
    setSelectedColor(product.variants[0].color);
    setSelectedSize("");
    // setShowCartBanner(true);
    // setTimeout(() => {
    //   setShowCartBanner(false);
    // }, 7000);
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={previewImage}
          className={styles.image}
          alt={name}
          fill
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (min-width: 769px) 30vw"
          priority={index <= 6}
        />
      </div>
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
          <Button text="add to cart" onClick={handleAddToCart} />
          {/* <button onClick={handleAddToCart} className={styles.addToCartButton}>
            add to cart
          </button> */}
        </div>
      </div>
    </div>
  );
}
