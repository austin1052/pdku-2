import {doc, getDoc, getDocs, collection} from 'firebase/firestore';
import { db } from './firebaseConfig';

export async function getCartFromFirebase(token: string) {
  const cartRef = doc(db, "carts", token);
  try {
    const res = await getDoc(cartRef);
    const cart = res.data()?.lineItems;
    return cart;
  } catch (error) {
    console.log("ERROR");
    console.log(error);
  }
}

export async function getAllProductsFromFirebase() {
  const querySnapshot = await getDocs(collection(db, "products"));
  const allProducts: any[] = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    allProducts.push(doc.data());
  });
  return allProducts;
}



export async function getShippingRegionsFromFirebase() {
  const shippingRef = doc(db, "shipping", "regions");
  const res = await getDoc(shippingRef);
  const shippingRegions = res.data();
  return shippingRegions
}
