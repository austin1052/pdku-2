import { NextApiRequest, NextApiResponse } from "next"

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prices = await stripe.prices.list();
  res.send(prices)
};

export default handler;