import type { AppProps } from "next/app";
// import Layout from "../components/Layout";
import Layout from "../components/Layout";
import { CartContextProvider } from "../context/CartContext";
import { IPContextProvider } from "../context/IPContext";
import { MobileContextProvider } from "../context/MobileContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MobileContextProvider>
      <CartContextProvider>
        <IPContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </IPContextProvider>
      </CartContextProvider>
    </MobileContextProvider>
  );
}

export default MyApp;
