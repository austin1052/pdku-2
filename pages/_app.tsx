import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { CartContextProvider } from "../context/CartContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <CartContextProvider>
        <Component {...pageProps} />
      </CartContextProvider>
    </Layout>
  );
}

export default MyApp;
