import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import {doc, setDoc} from "firebase/firestore"

admin.initializeApp();
const db = admin.firestore();

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
function verifyAuth(req: any) {
  const auth = req.get("Authorization");
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
      {success: true, message: `Variant added to ${product.id}`}
    );
  } catch (err) {
    console.error(err);
    res.status(500).send(
      {success: false, message: `Error adding variant to ${product.id}`}
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
    res.status(200).send(deletedProduct)
  } catch(error) {
    console.log(error);
  }
})

export const addVariantToFirebase = functions.https.onRequest(async (req, res) => {
  if (!verifyAuth(req)) {
      res.status(403).send({success: false, message: "Not Authorized"});
    }
    const { productId, variant } = req.body;
    const { variantId } = variant;
    try {
      const variantRef = db.collection("products").doc(productId)
        .collection("variants").doc(variantId);
      await variantRef.set(variant);
      res.status(200).send(
        {success: true, message: `Variant added to ${productId}`}
      );
    } catch (err) {
      console.error(err);
      res.status(500).send(
        {success: false, message: `Error adding variant to ${productId}`}
      );
    }
  });
  
export const getAllVariantDataFromFirebase = functions.https.onRequest(async (req, res) => {
    const { productId } = req.body;
    const variantsRef = db.collection("products").doc(productId).collection("variants");
    const snapshot = await variantsRef.get();
    const allVariants: productVariant[] = [];
    snapshot.forEach((doc: any) => {
      allVariants.push(doc.data())
    })

    res.status(200).send(allVariants)
    // const variantIds: any = []
})

export const getAllVariantIdsFromFirebase = functions.https.onRequest(async (req, res) => {
  if (!verifyAuth(req)) {
    res.status(403).send({success: false, message: "Not Authorized"});
  }
  const { productId } = req.body;
  // res.send({success: true, productId})
  const variantsRef = db.collection("products").doc(productId).collection("variants");
  const snapshot = await variantsRef.get();
  const allVariants: productVariant[] = [];
  snapshot.forEach((doc: any) => {
    allVariants.push(doc.id)
  })
  res.status(200).send(allVariants)
  // const variantIds: any = []
})

export const updateVariantInFirebase = functions.https.onRequest(async (req, res) => {
  if (!verifyAuth(req)) {
    res.status(403).send({success: false, message: "Not Authorized"});
  }
  const { productId, variant } = req.body;
  const { variantId } = variant;
  const variantRef = db.collection("products").doc(productId).collection("variants").doc(variantId);
  const updatedVariant = await variantRef.update({...variant})
  res.status(200).send(updatedVariant)
})

export const deleteVariantFromFirebase = functions.https.onRequest(async (req, res) => {
  if (!verifyAuth(req)) {
    res.status(403).send({success: false, message: "Not Authorized"});
  }
  try {
    const { productId, variantId } = req.body;
    const variantRef = db.collection("products").doc(productId).collection("variants").doc(variantId);
    const deletedVariant = await variantRef.delete()
    res.status(200).send(deletedVariant)
  } catch(error) {
    console.log(error);
  }
})

export interface productVariant {
  color: string,
  image: string
  price: string,
  size: string,
  stripePriceId: string,
  variantId: string,
  variantName: string,
}

export interface product {
  id: string,
  name: string,
  image: string
  price: string,
}
