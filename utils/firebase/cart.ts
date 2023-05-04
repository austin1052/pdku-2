import {doc, setDoc, getDoc, getDocs, collection} from 'firebase/firestore';
import { db } from './firebaseConfig';

// export async function addCartToFirebase(token: string, cart: Cart) {
//   const cartData = {
//     email: null,
//     created: new Date(),
//     lineItems: cart,
//   };
//   const cartRef = doc(db, "carts", token);
//   try {
//     await setDoc(cartRef, cartData);
//   } catch (error) {
//     console.log("ERROR");
//     console.log(error);
//   }
// }

export async function getCartFromFirebase(token: string) {
  const cartRef = doc(db, "carts", token);
  try {
    const res = await getDoc(cartRef);
    console.log(res.data());
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