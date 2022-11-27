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
    isCapUsd,
    isSlicerToBeCreated
  } = roundInfo
  const { name, description, logoUri, website, twitter, discord, docs } =
    metadata

  const isTargetEth = !isTargetUsd
  const isCapEth = !isCapUsd
  const target = isTargetUsd
    ? Number(ethers.utils.formatUnits(unformattedTarget, 6))
    : Number(ethers.utils.formatUnits(unformattedTarget, 14))
  const cap = isCapUsd
    ? Number(ethers.utils.formatUnits(Number(unformattedCap), 6))
    : Number(ethers.utils.formatUnits(unformattedCap, 14))

  const roundShares =
    Math.floor((afterRoundReservedRate * afterRoundSplits[0][2]) / 1e9) / 100 // TODO: Check first split address is address(0)

  const timestamp = project.configureEvents[0].timestamp // TODO: Figure out how to calculate this without using timestamp
  const duration = project.configureEvents[0].duration
  const deadline = timestamp + duration - new Date().getTime() / 1000

  const formatCurrency = (isEth: boolean, value: number) =>
    isEth ? value / 1e4 : value / 1e2

  const round: RoundData = {
    name,
    description,
    projectOwner,
    duration,
    target: formatCurrency(isTargetEth, target),
    cap: formatCurrency(isCapEth, cap),
    isTargetEth,
    isCapEth,
    isSlicerToBeCreated,
    tokenName,
    tokenSymbol,
    website,
    twitter,
    discord,
    docs,
    releaseTimelock,
    transferTimelock,
    roundTimelock: 0, // TODO:
    fundingCycleRound,
    tokenIssuance: Number(
      ethers.utils.formatEther(project.configureEvents[0].weight)
    ),
    image: {
      url: constants.ipfsGateway + String(logoUri).split("ipfs/")[1],
      file: undefined
    },
    addresses: [],
    shares: [roundShares],
    metadata: ""
  }

  return {
    round,
    deadline,
    totalContributions: Number(
      ethers.utils.formatUnits(totalContributions, 14)
    ),
    duration,
    isRoundClosed
  }
}

export default formatRound
