import { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import fetcher from "@utils/fetcher"

const getQuotes = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  try {
    if (req.method === "GET") {
      // TODO: Cache responses
      const { result } = await fetcher(
        `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_API_KEY}`
      )

      res.status(200).json(result?.ethusd)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
}

export default getQuotes
