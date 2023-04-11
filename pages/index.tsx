import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import styles from "../styles/Home.module.css";
import getStripe from "../utils/get-stripejs";

const Home: NextPage = () => {
  const [publishableKey, setPublishableKey] = useState<string | undefined>("");

  useEffect(() => {
    setPublishableKey(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }, []);

  function stripeData() {
    const stripe = getStripe();
    console.log(stripe);
  }

  stripeData();

  if (!publishableKey) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Please Don&rsquo;t Kill Us</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Please Don&rsquo;t Kill Us</h1>

        <p className={styles.description}>Interactive D&D</p>

        <div className={styles.grid}>
          <a href="" className={styles.card}>
            <h2>Hat</h2>
            <p>Ask me about my D&D campaign</p>
          </a>

          <a href="" className={styles.card}>
            <h2>Shirt</h2>
            <p>Ask me about my D&D campaign</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
