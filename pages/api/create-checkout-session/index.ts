import { NextApiRequest, NextApiResponse } from 'next'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // need to get price id from stripe
            price: "price_1N36bBLpLN5jLLuRcFPfla7D",
            quantity: 1,
          },
        ],
        mode: 'payment',
        // shipping_address_collection: {allowed_countries: ['US', 'CA']},
        // shipping_options: [
        //   {
        //     shipping_rate_data: {
        //       type: 'fixed_amount',
        //       fixed_amount: {amount: 399, currency: 'usd'},
        //       display_name: 'Free shipping',
        //       delivery_estimate: {
        //         minimum: {unit: 'business_day', value: 5},
        //         maximum: {unit: 'business_day', value: 7},
        //       }
        //     }
        //   }
        // ],          
        // success_url: `${req.headers.origin}/?success=true`,
        // cancel_url: `${req.headers.origin}/?canceled=true`,
        success_url: `https://pdku.vercel.app/?success=true`,
        cancel_url: `https://pdku.vercel.app/?canceled=true`,
      });
      // res.redirect(303, session.url);
      res.send({message: "Success", url: session.url});

    } catch (error: any) {
      res.status(error.statusCode || 500).json(error.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}