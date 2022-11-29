import { RoundViewMain, RoundViewMainLoading } from "@components/ui"
import getRounds from "@utils/getRounds"
import { useContractReads } from "wagmi"
import bluntDelegate from "abi/BluntDelegate.json"
import { Project } from "@prisma/client"

type Props = {
  projectData: Project[]
  subgraphData: any
  filteredAccount?: string
}

const RoundsList = ({ projectData, subgraphData, filteredAccount }: Props) => {
  const {
    data: roundInfo,
    isError,
    isLoading
  } = useContractReads({
    contracts: subgraphData?.map((project) => ({
      address: project.configureEvents[0].dataSource,
      abi: bluntDelegate.abi,
      functionName: "getRoundInfo"
    })),
    suspense: true
  })

  const { activeRounds, closedRounds } = getRounds(
    roundInfo,
    projectData,
    subgraphData
  )

  const filteredActiveRounds = filteredAccount
    ? activeRounds?.filter((el) => el.round.projectOwner == filteredAccount)
    : activeRounds
  const filteredClosedRounds = filteredAccount
    ? closedRounds?.filter((el) => el.round.projectOwner == filteredAccount)
    : closedRounds

  // TODO: Make deadline countdown without triggering unnecessary rerenders
  // const now = Math.floor(useNow() / 1000)

  return !roundInfo || !subgraphData ? (
    <div className="space-y-20">
      {[...Array(3)].map((el, key) => (
        <RoundViewMainLoading key={key} />
      ))}
    </div>
  ) : (
    <div className="space-y-20">
      {filteredActiveRounds?.map(
        ({ round, deadline, totalContributions, roundId }) => {
          return (
            <div key={roundId}>
              <RoundViewMain
                roundData={round}
                raised={totalContributions}
                roundId={roundId}
                deadline={deadline}
                secondary
                active
              />
            </div>
          )
        }
      )}
      {filteredClosedRounds.length != 0 && (
        <>
          <h1>Closed rounds</h1>
          {filteredClosedRounds?.map(
            ({ round, deadline, totalContributions, roundId }) => {
              return (
                <div key={roundId}>
                  <RoundViewMain
                    roundData={round}
                    raised={totalContributions}
                    roundId={roundId}
                    deadline={deadline}
                    secondary
                  />
                </div>
              )
            }
          )}
        </>
      )}
    </div>
  )
}

export default RoundsList
