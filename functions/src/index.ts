import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

function verifyAuth(req: any) {
  const auth = req.get("Authorization");
  // configure env variables in cloud functions using this command
  // firebase functions:config:set config.key="SECRET_KEY" config.pass="SECRET_PASS
  const secretKey = functions.config().secret.key;
  if (auth !== secretKey) {
    return false;
  }
  return true;
}
 
export const addProductToFirebase = functions.https.onRequest(async (req, res) => {
  if (!verifyAuth(req)) {
    res.status(403).send({success: false, message: "Not Authorized"});
  }
  const { product } = req.body;
  try {
    const productRef = db.collection("products").doc(product.id)
    await productRef.set(product);
    res.status(200).send(
      {success: true, message: `Product added: ${product.id}`}
    );
  } catch (err) {
    console.error(err);
    res.status(500).send(
      {success: false, message: `Error adding product: ${product.id}`}
    );
  }
});

export const deleteProductFromFirebase = functions.https.onRequest(async (req, res) => {
  if (!verifyAuth(req)) {
    res.status(403).send({success: false, message: "Not Authorized"});
  }
  try {
    const { productId } = req.body;
    const variantRef = db.collection("products").doc(productId);
    const deletedProduct = await variantRef.delete()
    res.status(200).send({message: "Product Deleted", product: deletedProduct})
  } catch(error) {
    console.log(error);
  }
})

export const getProduct = functions.https.onRequest(async (req, res) => {
  if (!verifyAuth(req)) {
    res.status(403).send({success: false, message: "Not Authorized"});
  }
  const { productId } = req.body;
  // res.send({success: true, productId})
  const productRef = db.collection("products").doc(productId);
  const product = await productRef.get();
  if (!product.exists) {
    res.status(404).send({success: false, message: "Product does not exist"})
  } else {
    res.status(200).send({success: true, product: product.data()})
  }
})

export const sendOrderConfirmationEmail = functions.https.onRequest(async (req, res) => {
  if (!verifyAuth(req)) {
    res.status(403).send({success: false, message: "Not Authorized"});
  }
  const { email, orderId, products } = req.body
  functions.logger.log("START FUNCTION")

  let baseTemplate = `<style>
                        body {background-color: rgb(223, 251, 240);}
                        h1 {color: grey;}
                        .image {width: 30px; height: 30px;}
                      </style>
                      <body>
                        <h1>Thank you for your order!</h1>
                        <p>Your order id is ${orderId}</p>
                        <p>You will receive another email with tracking details when your items ship.</p>
                        {{itemList}}
                      </body>`;

  const itemList = products.map((product: any) => {
  const {variantName: name, price, quantity, image} = product

    return (
      `<div class="item">
        <img class="image" src="${image}">
        <div>${name}</div>
        <div>Item Price: $${price}</div>
        <div>Quantity: ${quantity}</div>
        <div>Total: $${price * quantity}</div>
      </div>`
)
  })

    const totalTemplate = baseTemplate.replace('{{itemList}}', itemList.join());

    db.collection("mail")
    .add({
      to: email,
      message: {
        subject: `PDKU Order Confirmed!`,
        html: totalTemplate,
      }}
    )

    res.status(200).send("Email Sent")
})


    // return  `<div class="item>
    //                     <img class="image" src="${variant.images[0]}"}
    //                     <div>${variant.name}</div>
    //                     <div>Item Price: $${variant.price}</div>
    //                     <div>Quantity: ${quantity}</div>
    //                     <div>Total: $${variant.price * quantity}</div>
    //                   </div>
    //                   `

  // })



   //  const totalTemplate = baseTemplate.replace('{{itemList}}', itemTemplate);

  // let baseTemplate = `<style>
  //                       h1 {color: red;}
  //                       .item {color: green;}
  //                       .image {width: 30px; height: 30px}
  //                     </style>
  //                     <body>
  //                       <h1>Thank you for your order!</h1>
  //                       <p>Your order id is ${orderId}</p>
  //                       <p>You will receive another email with tracking details when your items ship.</p>
  //                       {{itemList}}
  //                     </body>`
  // let itemTemplate = "";

  //   db.collection("mail")
  // .add({
  //   to: email,
  //   message: {
  //     subject: `PDKU Order Confirmed!`,
  //     html: totalTemplate,
  //     // html: test,

  //   }}
  // )

// export const sendOrderConfirmationEmail = functions.https.onRequest(async (req, res) => {
//   try {

//     const { email, products } = req.body

    // let baseTemplate = `<style>
    //   h1 {color: red;}
    //   .item {color: green;}
    //   .image {width: 30px; height: 30px}
    // </style>
    // <body>
    //   <h1>Thank you for your order!</h1>
    //   <p>Your order id is ${orderId}</p>
    //   <p>You will receive another email with tracking details when your items ship.</p>
    //   {{itemList}}
    // </body>`;

//     // let itemTemplate = '';
//     const data = [];
//     res.status(200).send({products})

//     // Loop through the products array asynchronously
//     for (const product of products) {
//       const { productId, quantity } = product;

//       // Retrieve product data
//       const productRef = db.collection("products").doc(productId);
//       const productSnapshot = await productRef.get();
//       res.send({productSnapshot})
//       const productData = productSnapshot.data();
//       data.push({ productData, quantity });


//     //   // Find the variant for the given variantId
//     //   const variant = productData?.variants.find((v: any) => v.variantId === variantId.toString());

//     //   // Append variant data to the item template
//     //   if (variant) {
//     //     itemTemplate += `<div class="item">
//     //       <img class="image" src="${variant.images[0]}">
//     //       <div>${variant.name}</div>
//     //       <div>Item Price: $${variant.price}</div>
//     //       <div>Quantity: ${quantity}</div>
//     //       <div>Total: $${variant.price * quantity}</div>
//     //     </div>`;
//     //     data.push({ productData, variant, quantity });
//     //   }

//     }

//     // const totalTemplate = baseTemplate.replace('{{itemList}}', itemTemplate);

//     res.status(200).send({ email, data });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// });
