import { useEthUsd } from "./useEthUsd"

const useNormalizeCurrency = (
  value: number,
  isValueEth = true,
  convertToEth = true
) => {
  const ethUsd = useEthUsd()
  if (convertToEth) {
    return isValueEth ? value : value / ethUsd
  } else {
    return isValueEth ? value * ethUsd : value
  }
}

export default useNormalizeCurrency
