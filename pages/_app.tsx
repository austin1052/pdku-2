import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { CartContextProvider } from "../context/CartContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartContextProvider>
  );
}

export default MyApp;
