import Spinner from "@components/icons/Spinner"
import fetcher from "@utils/fetcher"
import multicall from "@utils/multicall"
import useQuery from "@utils/subgraphQuery"
import constants from "constants.json"
import { useEffect, useState } from "react"
import { useAppContext } from "../context"
import { RoundData } from "../CreateRoundForm/CreateRoundForm"
import RoundViewMain from "../RoundViewMain"

export const nullDate = 777600000
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
    enforceSlicerCreation: false,
    projectOwner: "0xAe009d532328FF09e09E5d506aB5BBeC3c25c0FF",
    raised: 160,
    roundId: 1,
    transferTimeLock: 0,
    releaseTimeLock: 0,
    roundTimeLock: 0,
    addresses: ["Blunt round"],
    shares: [10]
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
    enforceSlicerCreation: false,
    projectOwner: "0xAe009d532328FF09e09E5d506aB5BBeC3c25c0FF",
    raised: 1200000,
    roundId: 2,
    transferTimeLock: 1669820296053,
    releaseTimeLock: 0,
    roundTimeLock: 0,
    addresses: ["Blunt round"],
    shares: [10]
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
    enforceSlicerCreation: false,
    projectOwner: "0xAe009d532328FF09e09E5d506aB5BBeC3c25c0FF",
    raised: 400,
    roundId: 3,
    transferTimeLock: 1669820296053,
    releaseTimeLock: 1679820296053,
    roundTimeLock: 0,
    addresses: ["Blunt round"],
    shares: [10]
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
    target: 600,
    cap: 1000,
    isTargetEth: true,
    isCapEth: true,
    enforceSlicerCreation: true,
    projectOwner: "0xAe009d532328FF09e09E5d506aB5BBeC3c25c0FF",
    raised: 160,
    roundId: 4,
    transferTimeLock: 0,
    releaseTimeLock: 0,
    roundTimeLock: 0,
    addresses: ["Blunt round"],
    shares: [10]
  }
]

const MyRounds = () => {
  // TODO: Add subgraph fetch
  // const { account } = useAppContext()

  // const tokensQuery = /* GraphQL */ `
  //     projects(account: "${account?.toLowerCase()}") {
  //       ...
  //     }
  //   `
  // let subgraphData = useQuery(tokensQuery, [account])

  let subgraphData = [{ bluntDelegateAddress: "", cid: "" }]

  // TODO: Add on-chain fetch
  // const [roundInfo, setRoundInfo] = useState(null)

  // useEffect(() => {
  //   const getRoundInfo = async () => {
  //     const cids = []
  //     const bluntDelegates = subgraphData.map((project) => {
  //       cids.push(project.cid)
  //       return project.bluntDelegateAddress
  //     })

  //     const metadataPromises = Promise.all(
  //       cids.map((cid) => fetcher(constants.ipfsGateway + cid))
  //     )

  //     const [metadata, info] = await Promise.all([
  //       metadataPromises,
  //       multicall(bluntDelegates, "getRoundInfo()", "")
  //     ])

  //     setRoundInfo({ metadata, info })
  //   }

  //   if (subgraphData) {
  //     getRoundInfo()
  //   }
  // }, [subgraphData])

  return !subgraphData ? (
    <div className="flex justify-center">
      <Spinner size="h-12 w-12" />
    </div>
  ) : (
    <div className="space-y-20">
      {rounds.map((round, i) => (
        <div key={i}>
          <RoundViewMain
            roundData={round}
            raised={round.raised}
            roundId={round.roundId}
            secondary
          />
        </div>
      ))}
    </div>
  )
}

export default MyRounds
