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


// printful webhook req body
// {
//   type: 'product_updated',
//   created: 1682373750,
//   retries: 0,
//   store: 10460317,
//   data: {
//     sync_product: {
//       id: 306370990,
//       external_id: '6446f6e9941921',
//       name: 'Corduroy Cap! Woah!',
//       variants: 4,
//       synced: 4,
//       thumbnail_url: 'https://files.cdn.printful.com/files/013/0131d6f621f3d186afd8fa78bce284cc_preview.png',
//       is_ignored: false
//     }
//   }
// }


import { NextApiRequest, NextApiResponse } from 'next'
import { addVariantToFirebase, updateVariantInFirebase, getAllVariantIdsFromFirebase, deleteVariantFromFirebase, addProductToFirebase, deleteProductFromFirebase } from '../../../utils/firebase'

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
    const deletedVariants = await getAllVariantIdsFromFirebase(token, id)
    deletedVariants.forEach(async (variantId: string) => {
      await stripe.products.update(variantId, { active: false })
      deleteVariantFromFirebase(token, id, variantId)
    })
    deleteProductFromFirebase(token, id)
    res.send("200")
    return
  }

  if (requestType === "product_updated") {
    syncProductWithStripe(token, id)
    res.send("200")
    return
  }
}

async function syncProductWithStripe(token: string, productId: string) {

  // get product data from printful
  // productData is object with name, image, and price
  // variantData is array of objects with variantId, variantName, color, size, price, image
  const response = await fetch(`${apiURL}/products/printful/${productId}`);
  const [productData, variantData] = await response.json()
  // console.log({productData});
  // console.log({variantData});

  await addProductToFirebase(token, productData)

  // get array of variant ids from firebase
  // used after forEach to remove deleted products from stripe and firebase


  // *** get product, loop through product.variants, add all ids to array

  let allVariantIds = await getAllVariantIdsFromFirebase(token, productId)
  let availableProducts: string[] = []

  await Promise.all(variantData.length > 0 && variantData.map(async (variant: productVariant) => {
    const { variantId, variantName, price, images } = variant
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
            images 
          })  
          const newVariant = {...variant, stripePriceId: stripeProduct.default_price}

          // *** instead of adding variant, add variant to product object and then add product to firebase after looping through all variants
          addVariantToFirebase(token, productId, newVariant)
          return
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
      updateVariantInFirebase(token, productId, updatedVariant)
    }
  
    if (stripeProduct.name !== variantName) {
      await stripe.products.update(variantId, { name: variantName })
      updateVariantInFirebase(token, productId, variant)
    }

    // if product is in printful, it will be removed from the allVariantIds array
    // after map is finished, only deleted products will be left in the array
  
      const index = allVariantIds.indexOf(variantId)
      const available = allVariantIds.splice(index, 1)
      availableProducts.push(available)
  }))

  const deletedVariants = allVariantIds

  // *** keep above code, keep code to delete variant from stripe
  // *** instead of deleteVariantFromFirebase, just add product again to overwrite data

  // outside of forEach
  // loop through deleted array
  // archive product on stripe
  // remove document from firebase
  deletedVariants.forEach(async (variantId: string) => {
    await stripe.products.update(variantId, { active: false })
    deleteVariantFromFirebase(token, productId, variantId)
  })
}
  
export interface productVariant {
  color: string,
  images: string[]
  price: string,
  size: string,
  stripePriceId: string,
  variantId: string,
  variantName: string,
}

export interface product {
  id: string,
  name: string,
  image: string
  price: string,
}

export {}