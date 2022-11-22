import useSWR from "swr"
import fetcher from "./fetcher"

const useNormalizeCurrency = (
  value: number,
  isValueEth = true,
  convertToEth = true
) => {
  const { data: ethUsd } = useSWR(
    "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
    fetcher
  )
  if (convertToEth) {
    return isValueEth ? value : value / ethUsd?.price
  } else {
    return isValueEth ? value * ethUsd?.price : value
  }
}

export default useNormalizeCurrency
