import Spinner from "@components/icons/Spinner"
import { RoundViewMain } from "@components/ui"
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
  // TODO: Replace with actual delegate addresses
  const testDelegateAddress = "0x10F76F93C9BE0BA9fb047ecbB24a459DAF8F4137"

  const {
    data: roundInfo,
    isError,
    isLoading
  } = useContractReads({
    contracts: subgraphData?.map((project) => ({
      address: testDelegateAddress,
      // address: project.configureEvents[0].dataSource,
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

  return !roundInfo ? (
    <div className="flex justify-center">
      <Spinner size="h-12 w-12" />
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
