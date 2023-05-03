import { useState, useEffect } from "react";
import ProductCard from "../../components/products/ProductCard";
import CartBanner from "../../components/CartBanner";
import styles from "../../styles/ProductCard.module.css";
import { db } from "../../utils/firebase/firebaseConfig";
import { getDocs, collection } from "firebase/firestore";

export default function MerchPage({ allProducts }: any) {
  const [cart, setCart] = useState<Cart>();
  const [showCartBanner, setShowCartBanner] = useState(false);
  const [addedProduct, setAddedProduct] = useState<
    ProductVariant | undefined
  >();

  useEffect(() => {
    let localCart = localStorage.getItem("cart");
    if (typeof localCart === "string") {
      setCart(JSON.parse(localCart));
    }
  }, []);

  function addItemToCart(variant: ProductVariant) {
    const { stripePriceId } = variant;
    console.log("add");
    const cartCopy = cart ? [...cart] : [];
    const existingItem = cartCopy.find(
      (item) => item.stripePriceId === stripePriceId
    );
    if (existingItem !== undefined) {
      existingItem.quantity += 1;
    } else {
      cartCopy.push({ stripePriceId, quantity: 1 });
    }
    setCart(cartCopy);
    setAddedProduct(variant);
    const stringCart = JSON.stringify(cartCopy);
    localStorage.setItem("cart", stringCart);
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
            setShowCartBanner={setShowCartBanner}
            key={product.id}
          />
        );
      })}
    </div>
  );
}

export async function getStaticProps() {
  const querySnapshot = await getDocs(collection(db, "products"));
  const allProducts: any[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    allProducts.push(doc.data());
  });
  return {
    props: {
      allProducts,
    },
    revalidate: 30,
  };
}
