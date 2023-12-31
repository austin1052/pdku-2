import { NextApiRequest, NextApiResponse } from "next"
import { lookupIP } from "../../../../utils/IPRegistry";

async function getAllProducts(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`https://api.printful.com/store/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PRINTFUL_SECRET_KEY}`
      }
  });
  const allProducts = await response.json()
  res.send(allProducts)
  } catch(error) {
    console.error(error)
  }

  res.send("ERROR GETTING PRODUCTS")

};

export default getAllProducts;