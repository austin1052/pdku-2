import Navbar from "./Navbar";
import Footer from "./Footer";
import Head from "next/head";

export default function Layout2({ children }: any) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/favicon2.png" />
        <title>Please Don&apos;t Kill Us: An Interactive D&D Adventure</title>
      </Head>
      <div className="page-container">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
