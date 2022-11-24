import Spinner from "@components/icons/Spinner"
import fetcher from "@utils/fetcher"
import multicall from "@utils/multicall"
import useQuery from "@utils/subgraphQuery"
import { addresses } from "utils/constants"
import { useEffect, useState } from "react"
import { useAppContext } from "../context"
import { rounds } from "../MyRounds/MyRounds"
import RoundViewMain from "../RoundViewMain"

const AllRounds = () => {
  // TODO: Add subgraph fetch
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
        totalPaid
        metadataUri
        configureEvents {
          duration
          weight
        }
      }
    `
  let subgraphData = useQuery(tokensQuery)
  console.log(subgraphData)

  // let subgraphData = [{ bluntDelegateAddress: "", cid: "" }]

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

export default AllRounds
