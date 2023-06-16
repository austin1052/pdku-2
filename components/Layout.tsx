import Navbar from "./Navbar";
import Footer from "./Footer";
import Head from "next/head";
import Image from "next/image";
import pdkuPic from "../assets/images/pdku-skull.png";

export default function Layout({ children }: any) {
  return (
    <>
      <Head>
        {/* <link rel="shortcut icon" href="/images/favicon2.png" /> */}
        <title>Please Don&apos;t Kill Us: An Interactive D&D Adventure</title>
      </Head>
      {/* <div className="page-container"> */}
      <Navbar />
      <main>
        {children}
        {/* <Image className="background-image" src={pdkuPic} alt=""></Image> */}
      </main>
      {/* <Image className="background-image" src={pdkuPic} alt=""></Image> */}
      <Footer />
      {/* </div> */}
    </>
  );
}
