import { NextApiRequest, NextApiResponse } from "next"
import { getAllVariantIdsFromFirebase } from "../../../../utils/firebase"

async function getProduct(id: any) {
  const response = await fetch(`https://api.printful.com/store/products/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.PRINTFUL_SECRET_KEY}`
    }
  });
  const product = await response.json()
  return product
}

async function getProductById(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  try {
    let product = await getProduct(id)

    // thumbnail_url will be null on first request
    // request product every 3 seconds until thumbnail_url is not null
    // when thumbnail_url is not null, continue with formatting response
    while (product.result.sync_product.thumbnail_url === null) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      product = await getProduct(id)
    }

    const productName = product.result.sync_product.name
    const variants = product.result.sync_variants
    
    let productImage: string | undefined = undefined
    const variantData = variants.map((variant: any) => {
      // let { id: variantId, name: variantName, retail_price, product: {image}, files } = variant
      let { id: variantId, name: variantName, retail_price, files } = variant
      
      let images: string[] = []
      files.forEach((file: any) => {
        if (file.type === "preview") {
          // console.log("SET IMAGE");
          images.push(file.preview_url)
          if (productImage === undefined) {
            productImage = file.preview_url
          }
        }
      })


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
      const formattedProduct = {variantId, variantName, price: retail_price, size, color, images}
      return formattedProduct
    })
    const productData = {id, name: productName, image: productImage, price: variantData[0].price}
    // console.log(productData);
    res.status(product.code).send([productData, variantData])
  } catch (error: any) {
    res.send(error)
  }
}

export default getProductById;
