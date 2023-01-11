import useSWR from "swr"
import fetcher from "./fetcher"

const useNormalizeCurrency = (
  value: number,
  isValueEth = true,
  convertToEth = true
) => {
  const { data: ethUsd } = useSWR("/api/getEthUsd", fetcher)
  if (convertToEth) {
    return isValueEth ? value : value / Number(ethUsd)
  } else {
    return isValueEth ? value * Number(ethUsd) : value
  }
}

export default useNormalizeCurrency
