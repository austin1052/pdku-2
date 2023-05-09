import { NextApiRequest, NextApiResponse } from "next"


export default async function getProductById(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`https://api.printful.com/shipping/rates/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PRINTFUL_SECRET_KEY}`
      },
      body: req.body
    });
    const shippingData = await response.json()
    res.status(200).send(shippingData)
  } catch {
    console.error("error getting variant data")
  }
}