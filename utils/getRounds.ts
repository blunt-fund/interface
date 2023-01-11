import { ImageType } from "@components/ui/CreateFormAdvancedLinks/CreateFormAdvancedLinks"
import { Project } from "@prisma/client"
import { BigNumber } from "ethers"
import formatRound from "./formatRound"

export type RoundData = {
  name: string
  description: string
  projectOwner: string
  deadline: string | BigNumber
  target: number
  cap: number
  isTargetUsd: boolean
  isHardcapUsd: boolean
  isSlicerToBeCreated: boolean
  tokenSymbol: string
  tokenIssuance: number
  image: ImageType
  addresses: string[]
  shares: number[]
  transferTimelock: number
  releaseTimelock: number
  roundTimelock: number
  tokenName: string
  website: string
  twitter: string
  discord: string
  docs: string
  metadata: string
  fundingCycleRound?: number
}

export type RoundInfo = {
  round: RoundData
  totalContributions: number
  roundId: number
}

const getRounds = (
  roundInfo: any,
  projectData: Project[],
  subgraphData: any
) => {
  const closedRounds: RoundInfo[] = []
  const activeRounds: RoundInfo[] =
    roundInfo &&
    projectData &&
    subgraphData?.flatMap((project, i) => {
      const projectMetadata = projectData.find(
        (el) => el.projectId == project.projectId
      ).metadata
      const { round, totalContributions, deadline, isRoundClosed } =
        formatRound(project, roundInfo[i], projectMetadata)

      const data = {
        round,
        totalContributions,
        roundId: project.projectId
      }

      if (
        (deadline == 0 || deadline - new Date().getTime() / 1000 > 0) &&
        !isRoundClosed
      ) {
        return data
      } else {
        closedRounds.push(data)
        return []
      }
    })
  return { closedRounds, activeRounds }
}

export default getRounds
