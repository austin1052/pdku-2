import { NextApiRequest, NextApiResponse } from 'next'
import getProductById from '../products/printful/[id]'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("WEBHOOK")
  // const {id} = req.body.data.sync_product
  // console.log(req.body)
  
  // get product data from printful

  const id = 305370180

  const productData = await getProductById(id)
  console.log({productData})

  // create product in stripe using id, name, and price
  const product = await stripe.products.create({
    id,
    name: 'Gold Special',
  });
}