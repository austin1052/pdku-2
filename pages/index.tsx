import { useEffect } from "react";

export default function PreviewPage() {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  return (
    <form action="/api/checkout-sessions" method="POST">
      <section>
        <button type="submit" role="link">
          Checkout
        </button>
      </section>
      <style jsx>
        {`
          section {
            background: #ffffff;
            display: flex;
            flex-direction: column;
            width: 400px;
            height: 112px;
            border-radius: 6px;
            justify-content: space-between;
          }
          button {
            height: 36px;
            background: #556cd6;
            border-radius: 4px;
            color: white;
            border: 0;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          }
          button:hover {
            opacity: 0.8;
          }
        `}
      </style>
    </form>
  );
}

// import type { NextPage } from "next";
// import { useEffect, useState } from "react";
// import Head from "next/head";
// import Image from "next/image";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import styles from "../styles/Home.module.css";
// import getStripe from "../utils/get-stripejs";
// import { createCheckoutSession } from "./api/create-checkout-session";
// import { ForkOptions } from "child_process";

// const Home: NextPage = () => {
//   const [item, setItem] = useState({
//     name: "Apple AirPods",
//     description: "Latest Apple AirPods.",
//     image:
//       "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
//     quantity: 0,
//     price: 999,
//   });

//   useEffect(() => {
//     async function stripeData() {
//       const stripe = await getStripe();
//     }
//     stripeData();
//   }, []);

//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>Please Don&rsquo;t Kill Us</title>
//         <meta name="description" content="" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className={styles.main}>
//         <h1 className={styles.title}>Please Don&rsquo;t Kill Us</h1>

//         <p className={styles.description}>Interactive D&D</p>

//         <div className={styles.grid}>
//           <a href="" className={styles.card}>
//             <Image
//               className={styles.image}
//               src="/images/hat.jpg"
//               alt="hat"
//               fill
//             />
//             <h2>Hat</h2>
//             <p>Ask me about my D&D campaign</p>
//             <button onClick={handleClick}>Add to Cart</button>
//           </a>

//           <a href="" className={styles.card}>
//             <Image
//               className={styles.image}
//               src="/images/shirt.jpg"
//               alt="shirt"
//               fill
//             />
//             <h2>Shirt</h2>
//             <p>Ask me about my D&D campaign</p>
//             <button>Add to Cart</button>
//           </a>
//         </div>
//       </main>
//       <footer className={styles.footer}></footer>
//     </div>
//   );
// };

// export default Home;
