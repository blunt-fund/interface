import Spinner from "@components/icons/Spinner"
import fetcher from "@utils/fetcher"
import multicall from "@utils/multicall"
import useQuery from "@utils/subgraphQuery"
import constants from "constants.json"
import { useEffect, useState } from "react"
import { useAppContext } from "../context"
import { rounds } from "../MyRounds/MyRounds"
import RoundViewMain from "../RoundViewMain"

const AllRounds = () => {
  // TODO: Add subgraph fetch
  // const tokensQuery = /* GraphQL */ `
  //     projects(deployer: "${constants.bluntDelegateDeployer}") {
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
            name={round.name}
            image={round.image}
            website={round.website}
            twitter={round.twitter}
            discord={round.discord}
            docs={round.docs} // roundInfo && roundInfo[i].metadata.
            tokenSymbol={round.tokenSymbol} // roundInfo && roundInfo[i].info.
            tokenIssuance={round.tokenIssuance}
            duration={round.duration}
            target={round.target}
            cap={round.cap}
            isFundraiseEth={round.isFundraiseEth}
            raised={round.raised}
            roundId={round.roundId}
            reservedStake={round.reservedStake}
            secondary
          />
        </div>
      ))}
    </div>
  )
}

export default AllRounds
