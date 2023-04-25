import { product, productVariant } from "../../pages/api/webhooks";
import { doc, collection, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore"; 
import { db } from "./firebaseConfig";

// function to add new product to firestore

export async function addProductToFirebase(product: product) {
  const productRef = doc(db, "products", product.id)
  await setDoc(productRef, product);
}

export async function addVariantToFirebase(productId: string, variant: productVariant) {
  const { variantId } = variant
  try {
    const variantRef = doc(db, "products", productId, "variants", variantId)
    await setDoc(variantRef, variant);
  } catch(error: any) {
    console.log(error);
  }
}

export async function updateVariantInFirebase(productId: string, variant: productVariant) {
  const { variantId } = variant
  try {
    const variantRef = doc(db, "products", productId, "variants", variantId)
    await updateDoc(variantRef, {...variant});
  } catch(error: any) {
    console.log(error);
  }
}

// returns array of all variants for a product
export async function getAllVariantDataFromFirebase(productId: string) {
  const variantsRef = collection(db, "products", productId, "variants");
  const querySnapshot = await getDocs(variantsRef);
  const variantData: any = []
  querySnapshot.forEach((doc) => {
    variantData.push(doc.data())
  })
  return variantData
}

// returns array of variant IDs 
// 
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