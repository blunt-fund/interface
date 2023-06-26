import PriceFeed from "abi/PriceFeed.json"
import { BigNumber } from "ethers"
import { parseEther } from "viem"
import { useContractRead } from "wagmi"
import { addresses } from "./constants"

export const useEthUsd = () => {
  const { data: ethUsd } = useContractRead({
    address: addresses.PriceFeed,
    abi: PriceFeed.abi,
    functionName: "getQuote",
    args: [parseEther("1"), addresses.ethAddress, addresses.usdcAddress, 1800],
    staleTime: 60_000,
    scopeKey: "ethUsd"
  })

  return ethUsd && Number(BigNumber.from(ethUsd).div(1e4)) / 100
}
