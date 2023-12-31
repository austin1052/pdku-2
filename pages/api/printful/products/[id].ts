import { NextApiRequest, NextApiResponse } from "next"

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

async function getVariantDetails(id: any) {
  try {
    const response = await fetch(`https://api.printful.com/products/variant/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PRINTFUL_SECRET_KEY}`
      }
    });
    const variant = await response.json()
    return variant
  } catch {
    console.error("error getting variant data")
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  try {

    let product = await getProduct(id)
    console.log("PRODUCT", product);

    // thumbnail_url will be null on first request
    // request product every 5 seconds until thumbnail_url is not null
    // when thumbnail_url is not null, continue with formatting response
    while (product.result.sync_product.thumbnail_url === null) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      console.log("GET PRODUCT");
      product = await getProduct(id)
    }

    console.log("CONTINUE");

    const productName = product.result.sync_product.name
    const variants = product.result.sync_variants
    
    let productImage: string | undefined = undefined
    const variantData = await Promise.all(variants.map(async (variant: any) => {

      let { id: variantId, variant_id: catalogId, name: variantName, retail_price, files } = variant

      // get variant details from printful
      const variantDetails = await getVariantDetails(catalogId)
      const {size, color, color_code: colorCode} = variantDetails.result.variant

      let images: string[] = []
      files.forEach((file: any) => {
        if (file.type === "preview") {
          images.push(file.preview_url)
          if (productImage === undefined) {
            productImage = file.preview_url
          }
        }
      })

      // if there are no mockup images returned, set image to product image
      // this image will be a blank product with no design
      if (images.length === 0) {
        images.push(variant.product.image)
      }

      // stripe needs id as a string
      variantId = variantId.toString()

      const formattedProduct = {variantId, variantName, price: retail_price, size, color, colorCode, images, catalogId}
      return formattedProduct
    }))
    const productData = {id, name: productName, image: productImage, price: variantData[0].price}
    res.status(product.code).send([productData, variantData])
  } catch (error: any) {
    res.send(error)
  }
}
