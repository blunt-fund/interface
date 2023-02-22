import envConstants from "constants.json"

type Addresses = {
  BluntDelegateDeployer: `0x${string}`
  BluntDelegateProjectDeployer: `0x${string}`
  PriceFeed: `0x${string}`
  ethAddress: `0x${string}`
  usdcAddress: `0x${string}`
  JBTerminal: `0x${string}`
  JBDirectory: `0x${string}`
  JBTokenStore: `0x${string}`
  SliceCore: `0x${string}`
}

type Constants = {
  values: {
    ipfsGateway: string
  }
  addresses: {
    [chainId: string]: Addresses
  }
}

export const constants: any = envConstants.values

export const addresses: Addresses =
  envConstants.addresses[process.env.NEXT_PUBLIC_CHAIN_ID]

export default constants
