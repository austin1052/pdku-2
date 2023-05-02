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
import { addProductToFirebaseV2, deleteProductFromFirebaseV2, getAllVariantIdsFromFirebaseV2 } from '../../../utils/firebase'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/"
    : "https://pdku.show/api/";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  const token = req.body.store.toString()
  const id = req.body.data.sync_product.id.toString()
  const numberOfVariants = req.body.data.sync_product.variants
  const requestType = req.body.type

  if (token !== process.env.PRINTFUL_STORE_ID) {
    console.log("NOT AUTHORIZED");
    res.status(403).send({message: "You are not authorized to make this request"})
    return
  }

  if ((requestType === "product_updated" && numberOfVariants === 0) || (requestType === "product_deleted")) {
    let allVariantIds = await getAllVariantIdsFromFirebaseV2(token, id)

    allVariantIds.forEach(async (variantId: string) => {
      if (variantId !== undefined) {
        await stripe.products.update(variantId, { active: false })
      }
    })
    deleteProductFromFirebaseV2(token, id)
    // send "200" back to printful. If you just send status 200 printful will keep retrying the request
    res.send("200")
    return
  }

  if (requestType === "product_updated") {
    res.send("200")
    // printful takes some time before it sets product images
    // if product images are null there will be an error adding the product to stripe
    // this line makes the function wait 60 seconds before continuing
    await new Promise(resolve => setTimeout(resolve, 60000));
    syncProductWithStripe(token, id)
    return
  }
}

async function syncProductWithStripe(token: string, productId: string) {

  // get product data from printful
  // productData is object with name, image, and price
  // variantData is array of objects with variantId, variantName, color, colorCode, size, price, image

  const response = await fetch(`${apiURL}/printful/products/${productId}`);
  const [productData, variantData] = await response.json()

  let allVariantIds = await getAllVariantIdsFromFirebaseV2(token, productId)

  const formattedVariants = await Promise.all(variantData.map(async (variant: ProductVariant) => {
    const { variantId, variantName, price, images } = variant
    const priceInPennies = Number(price) * 100

    // if product is still in printful, its variant ID will be removed from this list
    // List of remaing variant IDs is used later to archive deleted variants from stripe
    if (allVariantIds.length > 0) {
      const index = allVariantIds.indexOf(variantId)
      allVariantIds.splice(index, 1)
    }

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
            images 
          })  
          const newVariant = {...variant, stripePriceId: stripeProduct.default_price}
          return newVariant
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
      const updatedVariant = {...variant, stripePriceId: updatedPrice.id}
      return updatedVariant
    }
  
    if (stripeProduct.name !== variantName) {
      await stripe.products.update(variantId, { name: variantName })
    }

    // if product is in printful, it will be removed from the allVariantIds array
    // after map is finished, only deleted products will be left in the array

      return {...variant, stripePriceId: stripeProduct.default_price}
  }))

  // archive deleted variants on stripe
  const deletedVariants = allVariantIds
  deletedVariants.forEach(async (variantId: string) => {
    if (variantId !== undefined) {
    await stripe.products.update(variantId, { active: false })
    }
  })

  // add variants to product object
  const updatedProduct = {...productData, variants: formattedVariants}

  // add updated/new product to firebase, this will overwrite the previous one with the updated information
  addProductToFirebaseV2(token, updatedProduct)
}

export {}