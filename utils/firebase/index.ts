import { productVariant } from "../../pages/api/webhooks";
import { doc, collection, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore"; 
import { db } from "./firebaseConfig";

// function to add new product to firestore

export async function addProductToFirebase(product: productVariant) {
  const {productId, variantId} = product
  try {
    const variantRef = doc(db, "products", productId, "variants", variantId)
    await setDoc(variantRef, product);
    const productRef = doc(db, "products", productId)
    await setDoc(variantRef, product);
  } catch(error: any) {
    console.log(error);
  }
}

export async function updateProductInFirebase(product: productVariant) {
  const {productId, variantId} = product
  try {
    const variantRef = doc(db, "products", productId, "variants", variantId)
    await updateDoc(variantRef, {...product});
  } catch(error: any) {
    console.log(error);
  }
}

export async function getAllVariantDataFromFirebase(productId: string) {
  const variantsRef = collection(db, "products", productId, "variants");
  const querySnapshot = await getDocs(variantsRef);
  const variantData: any = []
  querySnapshot.forEach((doc) => {
    variantData.push(doc.data())
  })
  return variantData
}

export async function getAllVariantIdsFromFirebase(productId: string) {
  const variantsRef = collection(db, "products", productId, "variants");
  const querySnapshot = await getDocs(variantsRef);
  const variantIds: any = []
  querySnapshot.forEach((doc) => {
    variantIds.push(doc.id)
  })
  return variantIds
}

export async function deleteVariantFromFirebase(productId: string, variantId: string) {
  await deleteDoc(doc(db, "products", productId, "variants", variantId));
}