import { useState, useEffect } from "react";
import Image from "next/image";
import DropdownMenu from "../DropdownMenu";
import styles from "../../styles/ProductCard.module.css";

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/"
    : "https://pdku.show/api/";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebaseConfig";

// Add a new document in collection "cities"
async function setData() {
  console.log("ADD DATA");
  console.log(db);
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Jack",
      last: "Dodge",
      born: 1997,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export default function ProductCard({ product }: any) {
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
      <button onClick={setData}>add to cart</button>
    </div>
  );
}
