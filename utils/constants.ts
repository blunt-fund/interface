import envConstants from "constants.json"

type Addresses = {
  BluntDelegateDeployer: string
  BluntDelegateProjectDeployer: string
  JBTerminal: string
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
