import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  publishableKey: string | undefined
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    res.status(200).json({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    })
    } else {
      res.status(405).end('Method not allowed')
    }
}