import { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"
import fetcher from "@utils/fetcher"
import { ethers } from "ethers"

const getQuotes = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)
  try {
    if (req.method === "GET") {
      // const cmcUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=1027&convert=USD`
      // const cmcKey = process.env.COIN_MARKET_CAP_KEY
      // const headers = {
      //   "X-CMC_PRO_API_KEY": cmcKey,
      //   Accept: "application/json"
      // }

      // const { data } = await fetcher(cmcUrl, {
      //   method: "GET",
      //   headers: headers
      // })

      // const quote = data[1027].quote.USD.price

      const { price } = await fetcher(
        "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
      )
      res.status(200).json(price)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
}

export default getQuotes
