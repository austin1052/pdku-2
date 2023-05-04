import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import ProductCard from "../../components/products/ProductCard";
import CartBanner from "../../components/CartBanner";
import styles from "../../styles/ProductCard.module.css";
import { db } from "../../utils/firebase/firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import {
  getCartFromFirebase,
  addCartToFirebase,
} from "../../utils/firebase/cart";

export default function MerchPage({ allProducts }: any) {
  const [cart, setCart] = useState<Cart>();
  const [showCartBanner, setShowCartBanner] = useState(false);
  const [addedProduct, setAddedProduct] = useState<
    ProductVariant | undefined
  >();

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function populateCart() {
      if (token !== null) {
        const cart = await getCartFromFirebase(token);
        setCart(cart);
      }
    }
    populateCart();
  }, []);

  console.log({ cart });

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
      addCartToFirebase(token, [addedProduct]);
      setCart([addedProduct]);
      window.dispatchEvent(new Event("storage"));
    } else {
      const cart = await getCartFromFirebase(localToken);
      const existingItem = cart.find(
        (item: CartItem) => item.stripePriceId === stripePriceId
      );
      if (existingItem !== undefined) {
        existingItem.quantity += 1;
      } else {
        cart.push(addedProduct);
      }
      window.dispatchEvent(new Event("storage"));
      addCartToFirebase(localToken, cart);
      setCart(cart);
    }

    // this event is needed to update the quantity show in the cart icon
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
