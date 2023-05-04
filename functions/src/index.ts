import * as functions from "firebase-functions";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import * as admin from "firebase-admin";
// import {doc, setDoc} from "firebase/firestore"

admin.initializeApp();
const db = admin.firestore();

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

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
 
export const addProductToFirebaseV2 = functions.https.onRequest(async (req, res) => {
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

export const deleteProductFromFirebaseV2 = functions.https.onRequest(async (req, res) => {
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

interface CartItem {
  variantId: string,
  price: string,
  stripePriceId: string,
  quantity: number,
  image: string,
  name: string
}

export const addToCart = functions.https.onCall(async (data, context) => {
  const { token, addedProduct } = data;
  const cartRef = db.collection('carts').doc(token);
  const cartDoc = await cartRef.get();
  if (cartDoc.exists) {
    const lineItems = cartDoc.data()?.lineItems;
    const existingItem = lineItems.find((item: CartItem) => item.variantId === addedProduct.variantId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      lineItems.push(addedProduct);
    }
    await cartRef.update({lineItems});
  } else {
    const cartData = {
      email: null,
      created: new Date(),
      lineItems: [addedProduct]
    };
    await cartRef.set(cartData);
  }
  return {success: true, message: "item added to cart" }
});