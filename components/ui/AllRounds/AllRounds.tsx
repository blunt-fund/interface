import Spinner from "@components/icons/Spinner"
import useQuery from "@utils/subgraphQuery"
import useMulticall from "@utils/useMulticall"
import { addresses } from "utils/constants"
import useRoundsMetadata from "@utils/useRoundsMetadata"
import { RoundsList } from "@components/ui"

const AllRounds = () => {
  // TODO: Finish subgraph fetch
  const tokensQuery = /* GraphQL */ `
    projects(
      where: {
        deployer: "${addresses.BluntDelegateProjectDeployer.toLowerCase()}"
      },
      orderBy: "createdAt", 
      orderDirection: "desc"
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
  const roundInfo = useMulticall(
    [
      testDelegateAddress,
      testDelegateAddress,
      testDelegateAddress,
      "0xbBC65902d8be06Ad1E17A011EC01b5185628F676", // data source for test 4
      testDelegateAddress,
      testDelegateAddress,
      testDelegateAddress
    ], // TODO: Replace with actual delegate addresses
    "getRoundInfo()",
    "",
    [subgraphData]
  )

  // TODO: Fix IPFS fetch logic
  // TODO: Add metadata backend optimization
  const metadata = useRoundsMetadata(projects)

  return !subgraphData || !roundInfo || !metadata ? (
    <div className="flex justify-center">
      <Spinner size="h-12 w-12" />
    </div>
  ) : (
    <RoundsList roundInfo={roundInfo} metadata={metadata} projects={projects} />
  )
}

export default AllRounds
