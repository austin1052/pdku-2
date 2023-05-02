import { NextApiRequest, NextApiResponse } from "next"

// returns variant info
// used to get size and color name/code for a variant
async function getVariantDetails(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    const response = await fetch(`https://api.printful.com/products/variant/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PRINTFUL_SECRET_KEY}`
      }
    });
    const variant = await response.json()
    res.send(variant)
  } catch {
    res.status(404).send({message: "variant not found"})
  }
}

export default getVariantDetails