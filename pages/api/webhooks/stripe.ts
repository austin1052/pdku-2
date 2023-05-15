import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // test secret
  // const endpointSecret = "whsec_5715a48f8243c77def47dce1463d7776a071dce14970d8f702c3c0bc75b525ad";
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  const buf = await buffer(req);
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        signature,
        endpointSecret
      );
    } catch (error: any) {
      console.log(`⚠️  Webhook signature verification failed.`, error.message);
      return res.status(400).send({success: false, message: "Webhook signature verification failed", error});
    }
  }
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;

      // remove cart from browser
      // get cart from firestore, compare total with paymentIntent.amount_received
      // 
      // send order to printful

      // payment intent object includes
      // shipping info => paymentIntent.shipping
      // receipt email => paymentIntent.receipt_email


      // console.log(paymentIntent);
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      break;
    case 'checkout.session.completed':
      const sessionWithLineItems = await stripe.checkout.sessions.listLineItems(
        event.data.object.id,
        // {
        //   expand: ['line_items'],
        // }
      );
      console.log(sessionWithLineItems);
      // const lineItems = sessionWithLineItems.line_items;
      // console.log(lineItems.data[0].price);
      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send("OK");
}