import { NextApiRequest, NextApiResponse } from "next"

async function getProductById(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  try {
    const response = await fetch(`https://api.printful.com/store/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PRINTFUL_SECRET_KEY}`
      }
  });
    const product = await response.json()
    const productDetails = product.result.sync_variants.map((variant: any) => {
      const { id, retail_price } = variant
      const variantDetails = variant.product.name.split("(")[1].split(")")[0]
      const color = variantDetails.split("/")[0].trim()
      const size = variantDetails.split("/")[1].trim()
      return {id, details: [ color, size], price: retail_price}
    })

    res.status(product.code).send(productDetails)
  } catch (error: any) {
    res.send(error)
  }
}

export default getProductById;