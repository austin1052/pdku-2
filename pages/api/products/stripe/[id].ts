import { NextApiRequest, NextApiResponse } from 'next'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  try {
    const stripeProduct = await stripe.products.retrieve(
      id
    )
    res.status(200).send(stripeProduct)
  } catch(error: any) {
    res.status(error.statusCode).send(error.message)
  }
} 