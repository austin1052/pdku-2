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
import { addProductToFirebase, deleteProductFromFirebase, getAllVariantIds, getProduct, getVariantPriceIds } from '../../../utils/firebase'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/"
    : "https://pdku.vercel.app/api";
    // : "https://pdku.show/api/";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.body.store.toString()
  const id = req.body.data.sync_product.id.toString()
  const numberOfVariants = req.body.data.sync_product.variants
  const requestType = req.body.type
  console.log(req.body);

  if (token !== process.env.PRINTFUL_STORE_ID) {
    console.log("NOT AUTHORIZED");
    res.status(403).send({messsage: "You are not authorized to make this request"})
    return
  }

  if ((requestType === "product_updated" && numberOfVariants === 0) || (requestType === "product_deleted")) {

    const firebaseProduct = await getProduct(id)
    const allVariantIds = await getAllVariantIds(firebaseProduct as Product)

    allVariantIds.forEach(async (variantId) => {
    await new Promise(resolve => setTimeout(resolve, 50))
      if (variantId !== undefined) {
        await stripe.products.update(variantId, { active: false })
      }
    })

    deleteProductFromFirebase(token, id)

    // send "200" back to printful. If you just send status 200 printful will keep retrying the request
    res.send("200")
    return
  }

  if (requestType === "product_updated") {
    res.send("200")
    // printful takes some time before it sets product images
    // if product images are null there will be an error adding the product to stripe
    // this line makes the function wait 60 seconds before continuing
    // await new Promise(resolve => setTimeout(resolve, 50000));
    syncProductWithStripe(token, id)
    return
  }
}

async function syncProductWithStripe(token: string, productId: string) {

  // get product data from printful
  // productData is object with name, image, and price
  // variantData is array of objects with variantId, variantName, color, colorCode, size, price, image

  const response = await fetch(`${apiURL}/printful/products/${productId}`);
  const [printfulProductData, variantData] = await response.json()

  let allVariantIds: (string | undefined)[] = [];
  let firebaseProduct: any;
  let priceIds: PriceData[];

  
  try {
    firebaseProduct = await getProduct(productId)
    allVariantIds = await getAllVariantIds(firebaseProduct)
    priceIds = await getVariantPriceIds(firebaseProduct)
    console.log("PRICE IDS", priceIds);
  } catch(error) {
    console.log("NO VARIANT DATA");
    allVariantIds = []
  }
 
  // stripe has a rate limit of 25 requests per second. This makes each request wait 50ms before running 
  async function mapWithDelay(array: ProductVariant[], callback: any, delay: number) {
    for (let i = 0; i < array.length; i++) {
      await callback(array[i]);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }


  const formattedVariants: ProductVariant[] = []
  
  await mapWithDelay(variantData, async (variant: ProductVariant) => {

  // const formattedVariants = await Promise.all(variantData.map(async (variant: ProductVariant) => {
    const { variantId, variantName, price, images } = variant
    const priceInPennies = Number(price) * 100

    // if product is still in printful, its variant ID will be removed from allVariantIds
    // after map is finished, only deleted products will be left in the array
    // List of remaing (deleted) variant IDs is used later to archive those variants on stripe

    if (allVariantIds.length > 0) {
      const index = allVariantIds.indexOf(variantId)
      allVariantIds.splice(index, 1)
    }

    // try to get stripe product. if it exists, check if values were updated
    // if it does not exist, create it in stripe
    let stripeProduct;
    try {
      const time = new Date()
      stripeProduct = await stripe.products.retrieve(variantId)
    } catch (error: any) {
      // if product does not exist on stripe, it will throw error "resource_missing"
      // the item will be created on stripe in this catch block
      if (error.code === "resource_missing") {
        try {
            console.log("create")
            stripeProduct = await stripe.products.create({
            id: variantId,
            name: variantName,
            default_price_data: {
              currency: "USD",
              unit_amount_decimal: priceInPennies
            },
            images 
          })  
          const priceIds = {"USD": stripeProduct.default_price, "AUD": "price_123"}
          const newVariant = {...variant, stripePriceId: stripeProduct.default_price, priceIds}
          formattedVariants.push(newVariant);
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

    let updatedVariant = variant;
  
    // compare price listed in sripe with price from printful, create new price if different
    if (priceUnitAmount !== priceInPennies) {
      const updatedPrice = await stripe.prices.create({
        unit_amount: priceInPennies,
        currency: 'usd',
        product: variantId,
        metadata: {variantId, productId}
      })

      // make new price default price, archive old price 
      await stripe.products.update(variantId, { default_price: updatedPrice.id })

      // ********* loop through priceIds array and archive all price Ids ************

      await stripe.prices.update(priceId, { active: false })


      const priceIds = {"USD": updatedPrice.id, "AUD": "price_123"}
      updatedVariant = {...variant, stripePriceId: updatedPrice.id, priceIds}
      // updatedVariant = {...variant, priceIds}
    }
  
    // compare name on sripe with name on printful, update name on stripe if different
    if (stripeProduct.name !== variantName) {
      await stripe.products.update(variantId, { name: variantName })
      const priceIds = {"USD": stripeProduct.default_price, "AUD": "price_123"}
      updatedVariant = {...variant, stripePriceId: stripeProduct.default_price, priceIds}
    }

    formattedVariants.push(updatedVariant);

  }, 50) // delay before next item in array

  // archive deleted variants on stripe
  const deletedVariants = allVariantIds
  deletedVariants.forEach(async (variantId) => {
    console.log("delete")
    await new Promise(resolve => setTimeout(resolve, 50))
    if (variantId !== undefined) {
    await stripe.products.update(variantId, { active: false })
    }
  })

  // add variants to product object
  const updatedProduct = {...printfulProductData, variants: formattedVariants}

  // add updated/new product to firebase, this will overwrite the previous one with the updated information
  console.log("ADD TO FIREBASE");
  addProductToFirebase(token, updatedProduct)
}

export {}