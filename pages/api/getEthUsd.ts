import { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import fetcher from "@utils/fetcher"
import { ethers } from "ethers"

const getQuotes = async (req: NextApiRequest, res: NextApiResponse) => {
  // await corsMiddleware(req, res)
  try {
    if (req.method === "GET") {
      const data = await fetcher(
        "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
      )
      console.log(data)

      res.status(200).json(data?.price)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
}

export default getQuotes
