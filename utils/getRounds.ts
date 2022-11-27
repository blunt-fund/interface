import { ethers } from "ethers"
import formatRoundInfo, { ReducedRoundData, RoundData } from "./formatRoundInfo"
import { constants } from "utils/constants"
import formatReducedRoundData from "./formatReducedRoundData"

export type RoundInfo = {
  round: RoundData
  deadline: number
  totalContributions: number
  roundId: number
}

const getRounds = (roundInfo: any, metadata: any, projects: any) => {
  const closedRounds: RoundInfo[] = []
  const activeRounds: RoundInfo[] =
    roundInfo &&
    metadata &&
    projects?.flatMap((project, i) => {
      const {
        totalContributions,
        target,
        cap,
        projectOwner,
        afterRoundReservedRate,
        afterRoundSplits,
        tokenSymbol,
        isRoundClosed,
        isTargetEth,
        isCapEth,
        isSlicerToBeCreated
      } = formatRoundInfo(roundInfo[i])
      const { name, description, logoUri } = metadata[i]
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
        totalContributions,
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
