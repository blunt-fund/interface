import Spinner from "@components/icons/Spinner"
import useQuery from "@utils/subgraphQuery"
import { addresses } from "utils/constants"
import { useAppContext } from "../context"
import { RoundData } from "utils/formatRoundInfo"
import useNow from "@utils/useNow"
import useRoundsMetadata from "@utils/useRoundsMetadata"
import useMulticall from "@utils/useMulticall"
import { RoundsList } from "@components/ui"

const MyRounds = () => {
  const { account } = useAppContext()
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

  const now = Math.floor(useNow() / 1000)

  return !subgraphData || !roundInfo || !metadata ? (
    <div className="flex justify-center">
      <Spinner size="h-12 w-12" />
    </div>
  ) : (
    <RoundsList
      roundInfo={roundInfo}
      metadata={metadata}
      projects={projects}
      account={account}
    />
  )
}

export default MyRounds

export const rounds: (RoundData & {
  raised: number
  roundId: number
})[] = [
  {
    name: "Token round",
    description: "A nice test project description **with markdown syntax**",
    image: { url: "", file: undefined },
    website: "https://slice.so",
    twitter: "jj_ranalli",
    discord: "https://slice.so",
    docs: "https://slice.so",
    tokenName: "Test round 1",
    tokenSymbol: "TEST1",
    tokenIssuance: 12345,
    duration: 21,
    target: 600,
    cap: 1000,
    isTargetEth: true,
    isCapEth: true,
    isSlicerToBeCreated: false,
    projectOwner: "0xAe009d532328FF09e09E5d506aB5BBeC3c25c0FF",
    raised: 160,
    roundId: 1,
    transferTimeLock: 0,
    releaseTimeLock: 0,
    roundTimeLock: 0,
    addresses: ["Blunt round"],
    shares: [0],
    metadata: ""
  },
  {
    name: "Slice round",
    description: "A nice test project description **with markdown syntax**",
    image: { url: "", file: undefined },
    website: "",
    twitter: "",
    discord: "",
    docs: "",
    tokenName: "Test round 2",
    tokenSymbol: "TEST2",
    tokenIssuance: 0,
    duration: 0,
    target: 300000,
    cap: 0,
    isTargetEth: false,
    isCapEth: false,
    isSlicerToBeCreated: false,
    projectOwner: "0xAe009d532328FF09e09E5d506aB5BBeC3c25c0FF",
    raised: 310,
    roundId: 2,
    transferTimeLock: 1669820296053,
    releaseTimeLock: 0,
    roundTimeLock: 0,
    addresses: ["Blunt round"],
    shares: [10],
    metadata: ""
  },
  {
    name: "Token & slice round",
    description: "A nice test project description **with markdown syntax**",
    image: { url: "", file: undefined },
    website: "",
    twitter: "",
    discord: "",
    docs: "",
    tokenName: "Test round 3",
    tokenSymbol: "TEST3",
    tokenIssuance: 1000000,
    duration: 14,
    target: 10,
    cap: 100000,
    isTargetEth: true,
    isCapEth: false,
    isSlicerToBeCreated: false,
    projectOwner: "0xAe009d532328FF09e09E5d506aB5BBeC3c25c0FF",
    raised: 40,
    roundId: 3,
    transferTimeLock: 1669820296053,
    releaseTimeLock: 1679820296053,
    roundTimeLock: 0,
    addresses: ["Blunt round"],
    shares: [10],
    metadata: ""
  },
  {
    name: "Token round with slicer",
    description: "A nice test project description **with markdown syntax**",
    image: { url: "", file: undefined },
    website: "https://slice.so",
    twitter: "jj_ranalli",
    discord: "https://slice.so",
    docs: "https://slice.so",
    tokenName: "Test round 1",
    tokenSymbol: "TEST1",
    tokenIssuance: 12345,
    duration: 21,
    target: 0,
    cap: 1000,
    isTargetEth: true,
    isCapEth: true,
    isSlicerToBeCreated: true,
    projectOwner: "0xAe009d532328FF09e09E5d506aB5BBeC3c25c0FF",
    raised: 160,
    roundId: 4,
    transferTimeLock: 0,
    releaseTimeLock: 0,
    roundTimeLock: 0,
    addresses: ["Blunt round"],
    shares: [0, 10, 2],
    metadata: ""
  }
]
