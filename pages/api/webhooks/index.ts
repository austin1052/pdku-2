// configure webhooks for printful using this curl command

// curl --location --request POST 'https://api.printful.com/webhooks' \
// --header 'Content-Type: application/json' \
// --header 'Authorization: Bearer <PRINTFUL_SECRET_KEY>' \
// --data-raw '{
//               "url": <WEBHOOK_URL>,
//               "types": [
//                 "product_updated"
//               ]
//             }'

// check configuration

// curl --location --request GET 'https://api.printful.com/webhooks' \
// --header 'Authorization: Bearer <PRINTFUL_SECRET_KEY>'

import { NextApiRequest, NextApiResponse } from 'next'
import { addProductToFirebase, updateProductInFirebase, getAllVariantDataFromFirebase, getAllVariantIdsFromFirebase, deleteVariantFromFirebase } from '../../../utils/firebase';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/"
    : "https://pdku.show/api/";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  if (req.body.type === "product_updated") {
    const id = req.body.data.sync_product.id.toString()
    syncProductWithStripe(id)
    return
  }
  if (req.body.type === "product_deleted") {
    const id = req.body.data.sync_product.id.toString()
    removeProductFromStripe(id)
    return
  }
  res.send("200")
}

async function syncProductWithStripe(productId: string) {

  // get product data from printful
  const response = await fetch(`${apiURL}/products/printful/${productId}`);
  const productData = await response.json()

  // get array of variant ids from firebase
  // used after forEach to remove deleted products from stripe and firebase
  let allVariantIds = await getAllVariantIdsFromFirebase(productId)
  let availableProducts: string[] = []
  console.log("Starting IDs", allVariantIds);
  await Promise.all(productData.map(async (variant: productVariant) => {
    const { variantId, variantName, price, image } = variant
    const priceInPennies = Number(price) * 100
    // try to get stripe product. if it exists, check if values were updated
    // if it does not exist, create it in stripe
    let stripeProduct
    try {
      stripeProduct = await stripe.products.retrieve(variantId)
    } catch (error: any) {
      if (error.code === "resource_missing") {
        try {
          const stripeProduct = await stripe.products.create({
            id: variantId,
            name: variantName,
            default_price_data: {
              currency: "USD",
              unit_amount_decimal: priceInPennies
            },
            images: [image] 
          })
          
          addProductToFirebase({...variant, stripePriceId: stripeProduct.default_price, productId})
        } catch (error: any) {
          console.log("Error creating product:", variantName)
          console.error(error)
        }
        return
      }
      console.log("Error retrieving product:", variantName)
      console.error(error)
      return
    }
  
    const priceId = stripeProduct.default_price
    const stripePrice = await stripe.prices.retrieve(priceId)
    const priceUnitAmount = stripePrice.unit_amount
  
    if (priceUnitAmount !== priceInPennies) {
      const updatedPrice = await stripe.prices.create({
        unit_amount: priceInPennies,
        currency: 'usd',
        product: variantId,
      })
      await stripe.products.update(variantId, { default_price: updatedPrice.id })
      await stripe.prices.update(priceId, { active: false })
      updateProductInFirebase({...variant, productId, stripePriceId: updatedPrice.id})
    }
  
    if (stripeProduct.name !== variantName) {
      await stripe.products.update(variantId, { name: variantName })
      updateProductInFirebase({...variant, productId})
    }

    // if product is in printful, it will be removed from the allVariantIds array
    // after map is finished, only deleted products will be left in the array
    const index = allVariantIds.indexOf(variantId)
    const available = allVariantIds.splice(index, 1)
    availableProducts.push(available)
  }))

  const deletedVariants = allVariantIds

  // outside of forEach
  // loop through deleted array
  // archive product on stripe
  // remove document from firebase
  deletedVariants.forEach(async (variantId: string) => {
    await stripe.products.update(variantId, { active: false })
    deleteVariantFromFirebase(productId, variantId)
  })
}

async function removeProductFromStripe(productId: string) {
  console.log("remove from stripe function");
  // use id to request all variants from firebase
  // use variant IDs to archive products in stripe
  const variants = await getAllVariantDataFromFirebase(productId)
  console.log({variants});
}
  
export interface productVariant {
  color: string,
  image: string
  productId: string
  productName?: string,
  price: string,
  size: string,
  stripePriceId: string,
  variantId: string,
  variantName: string,

}

export {}