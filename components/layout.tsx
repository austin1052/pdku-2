import Navbar from "./Navbar";
import Footer from "./Footer";
import Head from "next/head";

export default function Layout({ children }: any) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/logo-primary.png" />
        <title>Please Don&apos;t Kill Us: An Interactive D&D Adventure</title>
      </Head>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
