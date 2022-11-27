import Spinner from "@components/icons/Spinner"
import { RoundViewMain } from "@components/ui"
import getRounds from "@utils/getRounds"
import { useContractReads } from "wagmi"
import bluntDelegate from "abi/BluntDelegate.json"

type Props = {
  projectData: any
  subgraphData: any
  filteredAccount?: string
}

const RoundsList = ({ projectData, subgraphData, filteredAccount }: Props) => {
  // TODO: Replace with actual delegate addresses
  const testDelegateAddress = "0x0518a92F872e6B094491019dc0c658dB066bf16b"

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

  const { closedRounds, activeRounds } = getRounds(
    roundInfo,
    projectData,
    subgraphData
  )

  const filteredClosedRounds = filteredAccount
    ? closedRounds?.filter((el) => el.round.projectOwner == filteredAccount)
    : closedRounds
  const filteredActiveRounds = filteredAccount
    ? activeRounds?.filter((el) => el.round.projectOwner == filteredAccount)
    : activeRounds

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
    </div>
  )
}

export default RoundsList
