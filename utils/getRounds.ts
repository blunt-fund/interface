import { ImageType } from "@components/ui/CreateFormAdvancedLinks/CreateFormAdvancedLinks"
import { ethers } from "ethers"
import { constants } from "utils/constants"
import formatReducedRoundData from "./formatReducedRoundData"

export type RoundData = ReducedRoundData & {
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
  projectOwner: string
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

export type RoundInfo = {
  round: RoundData
  deadline: number
  totalContributions: number
  roundId: number
}

const getRounds = (roundInfo: any, projectData: any, subgraphData: any) => {
  console.log(roundInfo)

  const closedRounds: RoundInfo[] = []
  const activeRounds: RoundInfo[] =
    roundInfo &&
    projectData &&
    subgraphData?.flatMap((project, i) => {
      const {
        totalContributions,
        target: unformattedTarget,
        hardcap: unformattedCap,
        projectOwner,
        afterRoundReservedRate,
        afterRoundSplits,
        tokenSymbol,
        isRoundClosed,
        isTargetUsd,
        isCapUsd,
        isSlicerToBeCreated
      } = roundInfo[i]
      const { name, description, logoUri } = projectData[i].metadata

      const isTargetEth = !isTargetUsd
      const isCapEth = !isCapUsd
      const target = isTargetUsd
        ? Number(ethers.utils.formatUnits(unformattedTarget, 6))
        : Number(ethers.utils.formatUnits(unformattedTarget, 14))
      const cap = isCapUsd
        ? Number(ethers.utils.formatUnits(Number(unformattedCap), 6))
        : Number(ethers.utils.formatUnits(unformattedCap, 14))

      const roundShares =
        Math.floor((afterRoundReservedRate * afterRoundSplits[0][2]) / 1e9) /
        100 // TODO: Check first split address is address(0)

      const timestamp = project.configureEvents[0].timestamp // TODO: Figure out how to calculate this without using timestamp
      const duration = project.configureEvents[0].duration
      const deadline = timestamp + duration - new Date().getTime() / 1000

      const formatCurrency = (isEth: boolean, value: number) =>
        isEth ? value / 1e4 : value / 1e2

      const roundReduced: ReducedRoundData = {
        name,
        description,
        projectOwner,
        duration,
        target: formatCurrency(isTargetEth, target),
        cap: formatCurrency(isCapEth, cap),
        isTargetEth,
        isCapEth,
        isSlicerToBeCreated,
        tokenSymbol,
        tokenIssuance: Number(
          ethers.utils.formatEther(project.configureEvents[0].weight)
        ),
        image: {
          url: constants.ipfsGateway + String(logoUri).split("ipfs/")[1],
          file: undefined
        },
        addresses: [],
        shares: [roundShares]
      }
      const round: RoundData = formatReducedRoundData(roundReduced)
      const data = {
        round,
        deadline,
        totalContributions: Number(
          ethers.utils.formatUnits(totalContributions, 14)
        ),
        roundId: project.projectId
      }

      if ((duration == 0 || deadline > 0) && !isRoundClosed) {
        return data
      } else {
        closedRounds.push(data)
        return []
      }
    })
  return { closedRounds, activeRounds }
}

export default getRounds
