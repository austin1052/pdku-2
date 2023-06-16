import { useState, useEffect, useCallback } from "react";
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
  const [productPrice, setProductPrice] = useState<number>(formattedPrice);
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(undefined);
  const [productSizes, setProductSizes] = useState<string[]>();
  const [productColors, setProductColors] = useState<string[][]>();
  const [previewImage, setPreviewImage] = useState(image);
  const [selectedColor, setSelectedColor] = useState(product.variants[0].color);
  const [selectedSize, setSelectedSize] = useState(product.variants[0].size);

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
    const selected = variants.filter(
      (variant) =>
        variant.color === selectedColor && variant.size === selectedSize
    );
    setSelectedVariant(selected[0]);
  }, [variants, selectedColor, selectedSize]);

  useEffect(() => {
    if (selectedColor !== "") {
      variants.forEach((variant) => {
        if (variant.color === selectedColor) {
          setPreviewImage(variant.images[0]);
          return;
        }
      });
    }
  }, [selectedColor, variants]);

  function handleColorSelection(color: string) {
    if (selectedColor !== color) setSelectedColor(color);
  }

  function handleSizeSelection(size: string) {
    if (selectedSize !== size) setSelectedSize(size);
  }

  // need to know if product has size, color, or both
  // when color is clicked loop through variants, if selectedColor === variant.color && selectedSize === variant.size
  // setProductPrice exactly how you are adding to cart below
  // maybe a setSelectedVariant? when add to cart is clicked, just call addItemToCart(selectedVariant)

  function handleAddToCart() {
    addItemToCart(selectedVariant);
    setSelectedColor(product.variants[0].color);
    setSelectedSize(product.variants[0].size);
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
        <h3 className={styles.name}>{name}</h3>
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
                  onClick={() => handleColorSelection(color[0])}
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
                  onClick={() => handleSizeSelection(size)}
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
