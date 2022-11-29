import { ImageType } from "@components/ui/CreateFormAdvancedLinks/CreateFormAdvancedLinks"
import { Project } from "@prisma/client"
import formatRound from "./formatRound"

export type RoundData = {
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
  timestamp: number
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
      const { round, timestamp, totalContributions, duration, isRoundClosed } =
        formatRound(project, roundInfo[i], projectMetadata)

      const data = {
        round,
        timestamp,
        totalContributions,
        roundId: project.projectId
      }

      if (
        (duration == 0 ||
          timestamp + duration - new Date().getTime() / 1000 > 0) &&
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
