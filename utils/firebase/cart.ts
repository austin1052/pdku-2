import {doc, getDoc, getDocs, updateDoc, setDoc, collection} from 'firebase/firestore';
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

export async function addToCart(token: string, addedProduct: CartItem) {
  try {
    const cartRef = doc(db, "carts", token);
    const cartDoc = await getDoc(cartRef); 
    const lineItems = cartDoc.data()?.lineItems;
    if (lineItems) {
      const existingItem = lineItems.find((item: CartItem) => item.variantId === addedProduct.variantId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        lineItems.push(addedProduct);
      }
      await updateDoc(cartRef, {lineItems});
      return {success: true, message: "item added to cart", lineItems }
    } else {
      const cartData = {
        email: null,
        created: new Date(),
        lineItems: [addedProduct]
      };
      await setDoc(cartRef, cartData);
      return {success: true, message: "item added to cart", lineItems: [addedProduct]}
    }
  } catch (error) {
    console.log(error);
  }
}

export async function removeFromCart(token: string, removedProduct: CartItem) {
  try {
    const cartRef = doc(db, "carts", token);
    const cartDoc = await getDoc(cartRef); 
    const lineItems = cartDoc.data()?.lineItems;
    if (lineItems) {
      const updatedLineItems = lineItems.filter((item: CartItem) => item.variantId !== removedProduct.variantId);
      await updateDoc(cartRef, {lineItems: updatedLineItems});
      return {success: true, message: "item removed from cart", lineItems: updatedLineItems}
    } else {
    return {success: false, message: "cart not found" }
    } 
  } catch (error) {
    console.log(error);
  }
}

export async function updateItemQuantity(token: string, updatedItem: CartItem) {
  try {
    const cartRef = doc(db, "carts", token);
    const cartDoc = await getDoc(cartRef); 
    const lineItems = cartDoc.data()?.lineItems
    const updatedLineItems = lineItems.map((item: CartItem) => {
      if (item.variantId === updatedItem.variantId) {
        return {...item, quantity: updatedItem.quantity};
      }
      return item;
    });
    await updateDoc(cartRef, {lineItems: updatedLineItems});
    return {success: true, message: "item quantity updated", lineItems: updatedLineItems};
  } catch(error) {
    console.log(error);
    return {success: false, message: "cart not found" };
  }}

export async function getShippingRegionsFromFirebase() {
  const shippingRef = doc(db, "shipping", "regions");
  const res = await getDoc(shippingRef);
  const shippingRegions = res.data();
  return shippingRegions
}
