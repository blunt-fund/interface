import { ethers } from "ethers"
import constants from "./constants"
import { RoundData } from "./getRounds"

const formatRound = (project: any, roundInfo: any, metadata: any) => {
  const {
    totalContributions,
    target: unformattedTarget,
    hardcap: unformattedCap,
    projectOwner,
    afterRoundReservedRate,
    afterRoundSplits,
    tokenName,
    tokenSymbol,
    isRoundClosed,
    releaseTimelock,
    transferTimelock,
    fundingCycleRound,
    isTargetUsd,
    deadline,
    isHardcapUsd,
    isSlicerToBeCreated,
    isQueued
  } = roundInfo
  const {
    name,
    description,
    logoUri,
    infoUri: website,
    twitter,
    discord,
    docs
  } = metadata

  const target = isTargetUsd
    ? Number(ethers.utils.formatUnits(unformattedTarget, 6))
    : Number(ethers.utils.formatUnits(unformattedTarget, 14))
  const cap = isHardcapUsd
    ? Number(ethers.utils.formatUnits(Number(unformattedCap), 6))
    : Number(ethers.utils.formatUnits(unformattedCap, 14))

  const isFirstSplitSlicer =
    afterRoundSplits.length &&
    afterRoundSplits[0].beneficiary == ethers.constants.AddressZero
  const othersReserved = isFirstSplitSlicer
    ? afterRoundSplits.slice(1)
    : afterRoundSplits
  const calculateShares = (percent: number) =>
    Math.floor((afterRoundReservedRate * percent) / 1e9) / 100

  const roundShares = isFirstSplitSlicer
    ? calculateShares(afterRoundSplits[0].percent)
    : 0
  const othersReservedShares = calculateShares(
    othersReserved.reduce((a, b) => a + Number(b.percent), 0)
  )

  const roundTimelock = isFirstSplitSlicer
    ? Number(afterRoundSplits[0].lockedUntil)
    : 0

  const formatCurrency = (isEth: boolean, value: number) =>
    isEth ? value / 1e4 : value

  const round: RoundData = {
    name,
    description,
    projectOwner,
    deadline,
    target: formatCurrency(!isTargetUsd, target),
    cap: formatCurrency(!isHardcapUsd, cap),
    isTargetUsd,
    isHardcapUsd,
    isSlicerToBeCreated,
    tokenName,
    tokenSymbol,
    website,
    twitter,
    discord,
    docs,
    releaseTimelock,
    transferTimelock,
    roundTimelock,
    fundingCycleRound,
    tokenIssuance: Number(
      ethers.utils.formatEther(project.configureEvents[0].weight)
    ),
    image: {
      url: constants.ipfsGateway + String(logoUri).split("ipfs/")[1],
      file: undefined
    },
    addresses: [],
    shares: [roundShares, othersReservedShares],
    metadata: ""
  }

  return {
    round,
    deadline,
    totalContributions: Number(
      ethers.utils.formatUnits(totalContributions, 18)
    ),
    isQueued,
    isRoundClosed
  }
}

export default formatRound
