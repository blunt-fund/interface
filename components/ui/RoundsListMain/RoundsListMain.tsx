import { RoundViewMain, RoundViewMainLoading } from "@components/ui"
import getRounds from "@utils/getRounds"
import { useContractReads } from "wagmi"
import bluntDelegate from "abi/BluntDelegate.json"
import { Project } from "@prisma/client"
import Link from "next/link"

type Props = {
  projectData: Project[]
  subgraphData: any
}

const RoundsListMain = ({ projectData, subgraphData }: Props) => {
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

  const { activeRounds } = getRounds(roundInfo, projectData, subgraphData)

  const sortedActiveRounds = activeRounds
    ?.sort((a, b) => {
      return b.totalContributions - a.totalContributions
    })
    .slice(0, 3)

  return (
    <div>
      <h2 className="pt-6 pb-12 text-xl text-yellow-500 sm:pb-6">
        Top active rounds
      </h2>
      <div className="space-y-20 sm:space-y-8">
        {!sortedActiveRounds
          ? [...Array(3)].map((el, key) => <RoundViewMainLoading key={key} />)
          : sortedActiveRounds.map(({ round, totalContributions, roundId }) => {
              return (
                <div key={roundId}>
                  <RoundViewMain
                    roundData={round}
                    raised={totalContributions}
                    roundId={roundId}
                    smallTitle
                    isRoundClosed={false}
                    hasEndedUnsuccessfully={false}
                  />
                </div>
              )
            })}
      </div>
      <p className="pt-10 sm:pt-6">
        <Link
          href="/rounds"
          className="text-sm font-bold text-gray-600 underline hover:text-yellow-600"
        >
          View all rounds
        </Link>
      </p>
    </div>
  )
}

export default RoundsListMain
