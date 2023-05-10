import type { AppProps } from "next/app";
// import Layout from "../components/Layout";
import Layout2 from "../components/Layout2";
import { CartContextProvider } from "../context/CartContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout2>
      <CartContextProvider>
        <Component {...pageProps} />
      </CartContextProvider>
    </Layout2>
  );
}

export default MyApp;
