import Spinner from "@components/icons/Spinner"
import useQuery from "@utils/subgraphQuery"
import { addresses } from "utils/constants"
import RoundViewMain from "../RoundViewMain"
import useMulticall from "@utils/useMulticall"
import formatRoundInfo, { ReducedRoundData } from "@utils/formatRoundInfo"
import { RoundData } from "utils/formatRoundInfo"
import { constants } from "utils/constants"
import { ethers } from "ethers"
import formatReducedRoundData from "@utils/formatReducedRoundData"
import useRoundsMetadata from "@utils/useRoundsMetadata"
import useNow from "@utils/useNow"

const AllRounds = () => {
  // TODO: Finish subgraph fetch
  const tokensQuery = /* GraphQL */ `
    projects(
      where: {
        deployer: "${addresses.BluntDelegateProjectDeployer.toLowerCase()}"
      },
      orderBy: "createdAt", 
      orderDirection: "asc"
    ) {
      projectId
      owner
      createdAt
      metadataUri
      configureEvents {
        timestamp
        duration
        weight
        dataSource
      }
    }
  `
  let subgraphData = useQuery(tokensQuery)
  const projects = subgraphData?.projects

  const testDelegateAddress = "0x0518a92F872e6B094491019dc0c658dB066bf16b"
  const roundInfo = useMulticall([testDelegateAddress], "getRoundInfo()", "", [
    subgraphData
  ])
  // TODO: Fix IPFS fetch logic
  // TODO: Add metadata backend optimization
  const metadata = useRoundsMetadata(projects)

  const now = Math.floor(useNow() / 1000)

  return !subgraphData || !roundInfo || !metadata ? (
    <div className="flex justify-center">
      <Spinner size="h-12 w-12" />
    </div>
  ) : (
    <div className="space-y-20">
      {projects?.map((project, i) => {
        const {
          totalContributions,
          target,
          cap,
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
          100
        const timestamp = project.configureEvents[0].timestamp // TODO: Figure out how to calculate this without using timestamp
        const duration = project.configureEvents[0].duration
        const deadline = timestamp + duration - now
        const formatCurrency = (isEth: boolean, value: number) =>
          isEth ? value / 1e4 : value / 1e2

        const roundReduced: ReducedRoundData = {
          name,
          description,
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
          shares: [roundShares] // take from afterRoundSplits + afterRoundReservedRate
        }
        const round: RoundData = formatReducedRoundData(roundReduced)

        return (
          <div key={i}>
            <RoundViewMain
              roundData={round}
              raised={totalContributions}
              roundId={project.projectId}
              deadline={deadline}
              secondary
            />
          </div>
        )
      })}
    </div>
  )
}

export default AllRounds
