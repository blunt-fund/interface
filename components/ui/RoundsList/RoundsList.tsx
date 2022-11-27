import Spinner from "@components/icons/Spinner"
import { RoundViewMain } from "@components/ui"
import getRounds from "@utils/getRounds"
import useMulticall from "@utils/useMulticall"

type Props = {
  projectData: any
  subgraphData: any
  account?: string
}

const RoundsList = ({ projectData, subgraphData, account }: Props) => {
  // TODO: Replace with actual delegate addresses
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
    ],
    "getRoundInfo()",
    "",
    [subgraphData]
  )

  const { closedRounds, activeRounds } = getRounds(
    roundInfo,
    projectData,
    subgraphData
  )

  const filteredClosedRounds = account
    ? closedRounds?.filter((el) => el.round.projectOwner == account)
    : closedRounds
  const filteredActiveRounds = account
    ? activeRounds?.filter((el) => el.round.projectOwner == account)
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
