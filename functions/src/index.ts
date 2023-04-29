import * as functions from "firebase-functions";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import * as admin from "firebase-admin";
import {productVariant} from "../../pages/api/webhooks/other";
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


// ************

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