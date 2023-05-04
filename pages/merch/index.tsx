import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import ProductCard from "../../components/products/ProductCard";
import CartBanner from "../../components/CartBanner";
import styles from "../../styles/ProductCard.module.css";
import { getAllProductsFromFirebase } from "../../utils/firebase/cart";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const addToCart = httpsCallable(functions, "addToCart");

export default function MerchPage({ allProducts }: any) {
  const [showCartBanner, setShowCartBanner] = useState(false);
  const [addedProduct, setAddedProduct] = useState<
    ProductVariant | undefined
  >();

  async function addItemToCart(variant: ProductVariant) {
    const {
      stripePriceId,
      variantId,
      variantName: name,
      price,
      images,
    } = variant;

    const addedProduct: CartItem = {
      variantId,
      name,
      price,
      image: images[0],
      stripePriceId,
      quantity: 1,
    };

    setAddedProduct(variant);

    const localToken = localStorage.getItem("token");
    if (localToken === null) {
      const token = uuid();
      localStorage.setItem("token", token);
      await addToCart({ token, addedProduct });
    } else {
      await addToCart({ token: localToken, addedProduct });
    }

    // this event is needed to update the quantity in the cart icon
    window.dispatchEvent(new Event("addCartItem"));

    setShowCartBanner(true);
    setTimeout(() => {
      setShowCartBanner(false);
    }, 7000);
  }

  return (
    <div className={styles.container}>
      {showCartBanner && (
        <CartBanner
          product={addedProduct}
          setShowCartBanner={setShowCartBanner}
        />
      )}
      {allProducts.map((product: Product, index: number) => {
        return (
          <ProductCard
            product={product}
            index={index}
            addItemToCart={addItemToCart}
            key={product.id}
          />
        );
      })}
    </div>
  );
}

export async function getStaticProps() {
  const allProducts = await getAllProductsFromFirebase();
  return {
    props: {
      allProducts,
    },
    revalidate: 30,
  };
}
