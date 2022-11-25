import { ethers } from "ethers"

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
