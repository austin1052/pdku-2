import Navbar from "./Navbar";
import Footer from "./Footer";
import Head from "next/head";

export default function Layout({ children }: any) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/Bitter.ttf"
          as="font"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/KCAnvaHell.otf"
          as="font"
          type="font/ttf"
        />
        <link rel="shortcut icon" href="/images/logo-bw.png" />
        <title>Please Don&apos;t Kill Us: An Interactive D&D Adventure</title>
      </Head>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
