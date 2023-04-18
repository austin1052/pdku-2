import { NextApiRequest, NextApiResponse } from 'next'
import getProductById from '../products/printful/[id]'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/"
    : "https://pdku.show/api/";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  if (req.body.type === "product_updated") {
    const { id } = req.body.data.sync_product
    addProductToStripe(id)
  }
  res.send("200")
}

async function addProductToStripe(id: number) {

  // get product data from printful
  const response = await fetch(`${apiURL}/products/printful/${id}`);
  const productData = await response.json()
  console.log({data: productData});
  const productVariants = productData.result.sync_variants

  productVariants.forEach(async (variant: any) => {
    const {id, name, retail_price} = variant
    const formatedPrice = Number(retail_price) * 100
    const formatedId = id.toString()
    try {
      const stripeProduct = await stripe.products.retrieve(
        formatedId
      )
      const priceId = stripeProduct.default_price
      const stripePrice = await stripe.prices.retrieve(priceId)
      // price in pennies
      const priceUnitAmount = stripePrice.unit_amount
    
      if (priceUnitAmount !== formatedPrice) {
        // create new price
        const updatedPrice = await stripe.prices.create({
          unit_amount: formatedPrice,
          currency: 'usd',
          product: formatedId,
        });
        await stripe.products.update(formatedId, {default_price: updatedPrice.id})
        await stripe.prices.update(
          priceId,
          {active: false}
        );
      }
      if (stripeProduct.name !== name) {
        await stripe.products.update(formatedId, { name })
      }
    } catch (error: any) {
      if (error.code === "resource_missing") {
        await stripe.products.create({
          id,
          name,
          default_price_data: {
            currency: "USD",
            unit_amount_decimal: formatedPrice
          }
        });
        return
      }
      console.error(error)
    }
  })
}

export {}



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

// curl --location --request GET 'https://api.printful.com/webhooks' \
// --header 'Authorization: Bearer <PRINTFUL_SECRET_KEY>'

// const product = await stripe.products.create({
//   id,
//   name,
//   default_price_data: {
//     currency: "USD",
//     unit_amount_decimal: formatedPrice
//   }
// });