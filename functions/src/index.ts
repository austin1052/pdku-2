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
