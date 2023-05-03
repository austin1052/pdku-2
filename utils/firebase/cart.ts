import {doc, setDoc, getDoc} from 'firebase/firestore';
import { db } from './firebaseConfig';

export async function addCartToFirebase(token: string, cart: Cart) {
  const cartData = {
    email: null,
    created: new Date(),
    lineItems: cart,
  };
  const cartRef = doc(db, "carts", token);
  try {
    const res = await setDoc(cartRef, cartData);
    console.log(res);
  } catch (error) {
    console.log("ERROR");
    console.log(error);
  }
}

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