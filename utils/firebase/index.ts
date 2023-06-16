const cloudURL = "https://us-central1-pdku-e1ef3.cloudfunctions.net"
import { getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// ******

export async function getProduct(productId: string) {
  try {
    const productRef = doc(db, "products", productId);
    const res = await getDoc(productRef)
    const product = res.data()
    return product
  } catch(error: any) {
     console.log(error);
    }
}

export async function getProductVariant(productId: string, variantId: string) {
  try {
    const product = await getProduct(productId);
    const variant = product?.variants.filter((item: ProductVariant) => item.variantId === variantId )
    return variant
  } catch(error: any) {
     console.log(error);
    }
}

export async function getAllVariantIds(product: Product) {
  const variants = product.variants;
  const variantIds = variants.map((variant: ProductVariant) => {
    if (!variant) return
    return variant.variantId
  })
  return variantIds
}

export async function getVariantPriceIds(product: Product) {
  const variants = product.variants;
  const priceData = variants.map((variant: ProductVariant) => {
    const id = variant.variantId;
    const priceIds = variant.priceIds;
    return {[id]: priceIds}
  })
  console.log("PRICE DATA", priceData);
  return priceData
}

export async function sendOrderConfirmationEmail(token: string, email: string, orderId: string, products: EmailItem[]) {
  try {
    await fetch(`${cloudURL}/sendOrderConfirmationEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({email, orderId, products})
    })
  } catch(error: any) {
      console.log(error);
    }
}

export async function sendOrderAlertEmail(token: string, email: string, orderId: string, products: EmailItem[]) {
  try {
    await fetch(`${cloudURL}/sendOrderAlertEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({email, orderId, products})
    })
  } catch(error: any) {
      console.log(error);
    }
}

export async function addProductToFirebase(token: string, product: Product) {
  try {
    await fetch(`${cloudURL}/addProductToFirebase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({product})
    })
  } catch(error: any) {
      console.log(error);
    }
}

export async function deleteProductFromFirebase(token: string, productId: string) {
  try {
    const response = await fetch(`${cloudURL}/deleteProductFromFirebase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({productId})
    })
    console.log("DELETE FROM FIREBASE");
    const deletedProduct = await response.json() 
    return deletedProduct
  } catch(error: any) {
      console.log(error);
    }
}

export async function getLocationFromFirebase(token: string) {
  const locationRef = doc(db, "locations", token);
  try {
    const res = await getDoc(locationRef);
    const locationData = res.data();
    return locationData;
  } catch (error) {
    console.log("ERROR");
    console.log(error);
  }
}

export async function setLocationInFirebase(token: string, locationData: locationData) {
  const locationRef = doc(db, "locations", token);
  try {
    await setDoc(locationRef, locationData);
  } catch (error) {
    console.log("ERROR");
    console.log(error);
  }
}