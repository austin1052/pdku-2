import ProductCard from "../../components/products/ProductCard";
import styles from "../../styles/ProductCard.module.css";
import { db } from "../../utils/firebase/firebaseConfig";
import { getDocs, collection } from "firebase/firestore";

export default function merch({ allProducts }: any) {
  // console.log(allProducts);
  return (
    <div className={styles.container}>
      {allProducts.map((product: product) => {
        return <ProductCard product={product} key={product.id} />;
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

// export async function getStaticProps() {
//   const response = await fetch(`https://api.printful.com/store/products`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.PRINTFUL_SECRET_KEY}`,
//     },
//   });
//   const allProducts = await response.json();
//   return {
//     props: {
//       allProducts,
//     },
//     revalidate: 30,
//   };
// }

interface productVariant {
  // this id is stored in stripe and used to get price ID
  id: string;
  color: string;
  size: string;
  price: number;
}

interface product {
  // this product id is used to get product from printful
  id: string;
  image: string;
  name: string;
  price: string;
  description?: string[];
}

// create a collection for all products
// create a doc for each product
// to delete
// use product ID returned from pritnful webhook to queary firestore for all stripe IDs
// delete from stripe using id
// delete variants doc and product doc from firestore

// create items in firestore when adding to stripe
//
