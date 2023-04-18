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

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/"
    : "https://pdku.vercel.app/api/";

export async function getStaticProps() {
  const response = await fetch(`${apiURL}/products/printful`);
  const allProducts = await response.json();
  return {
    props: {
      allProducts,
    },
    revalidate: 30,
  };
}
