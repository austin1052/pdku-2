import { NextApiRequest, NextApiResponse } from "next"

async function getAllProducts(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch(`https://api.printful.com/store/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.PRINTFUL_SECRET_KEY}`
    }
});
const allProducts = await response.json()
res.send(allProducts)
};

export default getAllProducts;