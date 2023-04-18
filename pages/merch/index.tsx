import ProductCard from "../../components/products/ProductCard";
import styles from "../../styles/ProductCard.module.css";

export default function merch({ allProducts }: any) {
  return (
    <div className={styles.container}>
      {allProducts.result.map((product: any) => {
        return <ProductCard product={product} key={product.id} />;
      })}
    </div>
  );
}

export async function getStaticProps() {
  const response = await fetch(`https://api.printful.com/store/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PRINTFUL_SECRET_KEY}`,
    },
  });
  const allProducts = await response.json();
  return {
    props: {
      allProducts,
    },
    revalidate: 30,
  };
}
