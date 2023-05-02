import { productV2 } from "../../pages/api/webhooks/other"
import { product, productVariant } from "../../pages/api/webhooks";

const cloudURL = "https://us-central1-pdku-e1ef3.cloudfunctions.net"

export async function addProductToFirebase(token: string, product: product) {
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
    const deletedProduct = await response.json() 
    return deletedProduct
  } catch(error: any) {
      console.log(error);
    }
}

export async function addVariantToFirebase(token: string, productId: string, variant: productVariant) {
  try {
    await fetch(`${cloudURL}/addVariantToFirebase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({productId, variant})
    })
  } catch(error: any) {
      console.log(error);
    }
}

export async function updateVariantInFirebase(token: string, productId: string, variant: productVariant) {
  try {
    await fetch(`${cloudURL}/updateVariantInFirebase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({productId, variant})
    })
  } catch(error: any) {
    console.log(error);
  }
}

// returns array of all variants for a product
export async function getAllVariantDataFromFirebase(productId: string) {
  try {
    const response = await fetch(`${cloudURL}/getAllVariantDataFromFirebase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productId)
    })
    const variantData = await response.json() 
    return variantData
  } catch(error: any) {
      console.log(error);
    }
}

// returns array of variant IDs 
export async function getAllVariantIdsFromFirebase(token: string, productId: string) {
  try {
    const response = await fetch(`${cloudURL}/getAllVariantIdsFromFirebase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({productId})
    })
    const variantIds = await response.json() 
    return variantIds
  } catch(error: any) {
      console.log(error);
    }
}

export async function deleteVariantFromFirebase(token: string, productId: string, variantId: string) {
  try {
    const response = await fetch(`${cloudURL}/deleteVariantFromFirebase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({productId, variantId})
    })
    const deletedVariant = await response.json() 
    return deletedVariant
  } catch(error: any) {
      console.log(error);
    }
}


// ******

export async function addProductToFirebaseV2(token: string, product: productV2) {
  try {
    await fetch(`${cloudURL}/addProductToFirebaseV2`, {
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

export async function deleteProductFromFirebaseV2(token: string, productId: string) {
  try {
    const response = await fetch(`${cloudURL}/deleteProductFromFirebaseV2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({productId})
    })
    const deletedProduct = await response.json() 
    return deletedProduct
  } catch(error: any) {
      console.log(error);
    }
}

export async function getAllVariantIdsFromFirebaseV2(token: string, productId: string) {
  try {
    const response = await fetch(`${cloudURL}/getProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({productId})
    })
    const data = await response.json()
    console.log("DATA");
    console.log(data);
    if (data.success) {
      const variants = data.product.variants
      const variantIds = variants.map((variant: productVariant) => {
        if (!variant) return
        return variant.variantId
      })
      return variantIds
    }
    return []
  } catch(error: any) {
      console.log(error);
      return []
    }
}