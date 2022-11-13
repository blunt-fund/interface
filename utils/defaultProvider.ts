import { ethers } from "ethers"

const defaultProvider = new ethers.providers.JsonRpcBatchProvider(
  process.env.NEXT_PUBLIC_NETWORK_URL
)

export default defaultProvider
