import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { sendOrderConfirmationEmail, getProductVariant } from '../../../utils/firebase';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
export const config = {
  api: {
    bodyParser: false,
  },
};

async function createPrintfulOrder(orderDetails: PrintfulOrder) {
  // console.log(items);
  const response = await fetch("https://api.printful.com/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.PRINTFUL_SECRET_KEY}`
    },
    body: JSON.stringify(orderDetails)
  });
  const order = await response.json()
  return order
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // test secret
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST;
  const token = process.env.PRINTFUL_STORE_ID!;

  // const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  const buf = await buffer(req);

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
  const paymentIntent = event.data.object;
  // console.log("intent", paymentIntent);

  // Handle the event
  switch (event.type) {

    case 'payment_intent.succeeded':

      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      break;

    case 'checkout.session.completed':

      const sessionWithLineItems = await stripe.checkout.sessions.listLineItems(event.data.object.id);
      sessionWithLineItems.data.forEach(((item: any) => console.log(item.price.metadata)))
      console.log(sessionWithLineItems);

      const customerName = paymentIntent.shipping_details.name
      const { line1, line2, city, state, country, postal_code } = paymentIntent.shipping_details.address
      const customerEmail = paymentIntent.customer_details.email

      const formattedAddress = {
        name: customerName, 
        address1: line1,
        address2: line2,
        city: city,
        state_code: state,
        country_code: country,
        zip: postal_code
      }

      const printfulItems: PrintfulItem[] = [];
      // const emailItems: EmailItem[] = [];

      // call firebase to get product data here
      // attach to emailItems --> {productId, variantId, image, name, price}

      const emailItems: EmailItem[] = await Promise.all(sessionWithLineItems.data.map(async (item: any) => {
        
        const variantId = item.price.metadata.variantId
        const productId = item.price.metadata.productId
        
        const variant = await getProductVariant(productId, variantId)

        const {variantName, price} = variant[0]
        const quantity = item.quantity
        const image = variant[0].images[0]

        printfulItems.push({
          sync_variant_id: Number(variantId),
          quantity
        })
        return {variantName, price, quantity, image}
      }))

      console.log("PRINTFUL ITEMS");
      console.log(printfulItems);

      console.log("EMAIL ITEMS");
      console.log(emailItems);

      const order = await createPrintfulOrder({recipient: formattedAddress, items: printfulItems})
      const orderId = order.result.id
      const orderDetails = {email: customerEmail, orderId, items: emailItems, }
      sendOrderConfirmationEmail(token, customerEmail, orderId, emailItems)
      break;

    default:

      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send("OK");
}