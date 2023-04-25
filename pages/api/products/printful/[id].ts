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
    const productName = product.result.sync_product.name
    const variants = product.result.sync_variants
    const variantData = variants.map((variant: any) => {
      // console.log(variant);
      let { id: variantId, name: variantName, retail_price, product: {image} } = variant

      // stripe needs id as a string
      variantId = variantId.toString()

      // variant.product.name is set by printful
      // Always looks like ---> Product Name (color / size) or Product Name (size) or Product Name (color/color/... / size) 
      // the spaces are important " / " separates color and size. "/" seperates multiple of the same detail 
      // variant details selects the part in parenthesis
      const variantDetails = variant.product.name.split("(")[1].split(")")[0]
      const detailsDivider = " / "

      // returns -1 if there is no detailsDivider
      const endOfColor = variantDetails.lastIndexOf(detailsDivider)
      const color = endOfColor === -1 ? variantDetails : variantDetails.slice(0, endOfColor)
      const size = endOfColor === -1 ? "" : variantDetails.slice(endOfColor + detailsDivider.length)
      const formattedProduct = {variantId, variantName, price: retail_price, size, color, image}
      return formattedProduct
    })
    const productData = {id, name: productName, image: variantData[0].image, price: variantData[0].price}
    res.status(product.code).send([productData, variantData])
  } catch (error: any) {
    res.send(error)
  }
}

export default getProductById;
