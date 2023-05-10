import { NextApiRequest, NextApiResponse } from 'next'
import { getShippingRegionsFromFirebase } from '../../../utils/firebase/cart'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const {country, region, stripeLineItems} = JSON.parse(req.body)
  const shippingRegions = await getShippingRegionsFromFirebase();
  const shippingCost: number = shippingRegions && shippingRegions[region as keyof ShippingRegions];

  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: stripeLineItems,
        mode: 'payment',
        shipping_address_collection: {allowed_countries: [country]},
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {amount: (shippingCost*100), currency: 'usd'},
              display_name: 'Flat rate shipping',
            }
          }
        ],          
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });

      res.status(200).send({message: "Success", url: session.url});

    } catch (error: any) {
      res.status(error.statusCode || 500).json(error.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}