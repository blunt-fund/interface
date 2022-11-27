import { RoundViewMain } from "@components/ui"
import getRounds from "@utils/getRounds"

type Props = {
  roundInfo: any
  metadata: any
  projects: any
  account?: string
}

const RoundsList = ({ roundInfo, metadata, projects, account }: Props) => {
  const { closedRounds, activeRounds } = getRounds(
    roundInfo,
    metadata,
    projects
  )

  const filteredClosedRounds = account
    ? closedRounds.filter((el) => el.round.projectOwner == account)
    : closedRounds
  const filteredActiveRounds = account
    ? activeRounds.filter((el) => el.round.projectOwner == account)
    : activeRounds

  // TODO: Make deadline countdown without triggering unnecessary rerenders
  // const now = Math.floor(useNow() / 1000)

  return (
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
