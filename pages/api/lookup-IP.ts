import { NextApiRequest, NextApiResponse } from "next"
import { lookupIP } from "../../utils/IPRegistry";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const IPRegistryKey = process.env.IP_REGISTRY_KEY!;
  try {
    const data = await lookupIP(IPRegistryKey)
    res.send(data)
  } catch(error) {
    console.error(error)
  }
  res.send("ERROR LOOKING UP IP")

};

export default handler;