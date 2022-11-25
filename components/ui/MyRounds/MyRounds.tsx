import Spinner from "@components/icons/Spinner"
import fetcher from "@utils/fetcher"
import multicall from "@utils/multicall"
import useQuery from "@utils/subgraphQuery"
import { useEffect, useState } from "react"
import { addresses, constants } from "utils/constants"
import { useAppContext } from "../context"
import formatRoundInfo, {
  ReducedRoundData,
  RoundData
} from "utils/formatRoundInfo"
import RoundViewMain from "../RoundViewMain"
import useNow from "@utils/useNow"
import useRoundsMetadata from "@utils/useRoundsMetadata"
import useMulticall from "@utils/useMulticall"
import { ethers } from "ethers"
import formatReducedRoundData from "@utils/formatReducedRoundData"

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
      testDelegateAddress,
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
    <div className="space-y-20">
      {projects.map((project, i) => {
        const {
          totalContributions,
          target,
          cap,
          afterRoundReservedRate,
          afterRoundSplits,
          tokenSymbol,
          projectOwner,
          isRoundClosed,
          isTargetEth,
          isCapEth,
          isSlicerToBeCreated
        } = formatRoundInfo(roundInfo[i])

        if (projectOwner == account) {
          const { name, description, logoUri } = metadata[i]
          const roundShares =
            Math.floor(
              (afterRoundReservedRate * afterRoundSplits[0][2]) / 1e9
            ) / 100 // TODO: Check first split address is address(0)
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
            shares: [roundShares]
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
        }
      })}
    </div>
  )
}

export default MyRounds
