import { ImageType } from "@components/ui/CreateFormAdvancedLinks/CreateFormAdvancedLinks"
import { ethers } from "ethers"

export type RoundData = ReducedRoundData & {
  projectOwner: string
  transferTimeLock: number
  releaseTimeLock: number
  roundTimeLock: number
  tokenName: string
  website: string
  twitter: string
  discord: string
  docs: string
  metadata: string
  fundingCycleRound?: number
}

export type ReducedRoundData = {
  name: string
  description: string
  duration: number
  target: number
  cap: number
  isTargetEth: boolean
  isCapEth: boolean
  isSlicerToBeCreated: boolean
  tokenSymbol: string
  tokenIssuance: number
  image: ImageType
  addresses: string[]
  shares: number[]
}

const formatRoundInfo = (data: string) => {
  const abiCoder = new ethers.utils.AbiCoder()
  if (data) {
    const [
      totalContributions,
      target,
      cap,
      releaseTimeLock,
      transferTimeLock,
      projectOwner,
      fundingCycleRound,
      afterRoundReservedRate,
      afterRoundSplits,
      tokenName,
      tokenSymbol,
      isRoundClosed,
      isQueued,
      isTargetUsd,
      isCapUsd,
      isSlicerToBeCreated,
      slicerId
    ] = abiCoder.decode(
      [
        "tuple(uint256, uint256, uint256, uint40, uint40, address, uint40, uint16, tuple(bool, bool, uint256, uint256, address, uint256, address)[], string, string, bool, bool, bool, bool, bool, uint256)"
      ],
      data
    )[0]

    return {
      totalContributions,
      target,
      cap,
      releaseTimeLock,
      transferTimeLock,
      projectOwner,
      fundingCycleRound,
      afterRoundReservedRate,
      afterRoundSplits,
      tokenName,
      tokenSymbol,
      isRoundClosed,
      isQueued,
      isTargetEth: !isTargetUsd,
      isCapEth: !isCapUsd,
      isSlicerToBeCreated,
      slicerId
    }
  }
}

export default formatRoundInfo
