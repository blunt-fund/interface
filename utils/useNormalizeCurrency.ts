import { useEthUsd } from "./useEthUsd"

const useNormalizeCurrency = (
  value: number,
  isValueEth = true,
  convertToEth = true
) => {
  const ethUsd = useEthUsd()
  if (convertToEth) {
    return isValueEth ? Number(value) : value / ethUsd
  } else {
    return isValueEth ? Number(value) * ethUsd : value
  }
}

export default useNormalizeCurrency
