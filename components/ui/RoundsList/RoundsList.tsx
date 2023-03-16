import { MySwitch, RoundViewMain, RoundViewMainLoading } from "@components/ui"
import getRounds, { RoundInfo } from "@utils/getRounds"
import { useContractReads } from "wagmi"
import bluntDelegate from "abi/BluntDelegate.json"
import { Project } from "@prisma/client"
import { useEffect, useState } from "react"
import { useEthUsd } from "@utils/useEthUsd"

type Props = {
  projectData: Project[]
  subgraphData: any
  accountFilter?: string
}

const RoundsList = ({ projectData, subgraphData, accountFilter }: Props) => {
  const [rounds, setRounds] = useState<{
    filteredActiveRounds: RoundInfo[]
    filteredClosedRounds: RoundInfo[]
  }>()
  const [onlySuccess, setOnlySuccess] = useState(false)

  const ethUsd = useEthUsd()

  const {
    data: roundInfo,
    isError,
    isLoading
  } = useContractReads({
    contracts: subgraphData?.map((project) => ({
      address: project.configureEvents[0].dataSource,
      abi: bluntDelegate.abi,
      functionName: "getRoundInfo"
    }))
  })

  const getAccountRounds = (rounds: RoundInfo[]) =>
    accountFilter
      ? rounds?.filter((el) => el.round.projectOwner == accountFilter)
      : rounds

  const displayedClosedRounds = onlySuccess
    ? rounds?.filteredClosedRounds.filter((el) => {
        const targetEth = !el.round.isTargetUsd
          ? el.round.target
          : el.round.target / Number(ethUsd)
        return el.totalContributions > targetEth && !el.hasEndedUnsuccessfully
      })
    : rounds?.filteredClosedRounds

  useEffect(() => {
    if (roundInfo && projectData && subgraphData) {
      const { activeRounds, closedRounds } = getRounds(
        roundInfo,
        projectData,
        subgraphData
      )

      const filteredActiveRounds = getAccountRounds(activeRounds)
      const filteredClosedRounds = getAccountRounds(closedRounds)

      setRounds({ filteredActiveRounds, filteredClosedRounds })
    }
  }, [roundInfo, projectData, subgraphData])

  return (
    <>
      {(!rounds || rounds.filteredActiveRounds.length != 0) && (
        <div className="pb-20 space-y-20 sm:space-y-8">
          {!rounds
            ? [...Array(3)].map((el, key) => <RoundViewMainLoading key={key} />)
            : rounds.filteredActiveRounds
                ?.sort((a, b) => {
                  return b.totalContributions - a.totalContributions
                })
                .map(({ round, totalContributions, roundId }) => {
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
      )}
      <>
        <div className="pb-12">
          <h2 className="pb-10 text-xl text-gray-500">Closed rounds</h2>
          <MySwitch
            label="Show only successful rounds"
            enabled={onlySuccess}
            setEnabled={setOnlySuccess}
            alignRight
          />
        </div>
        <div className="space-y-20">
          {displayedClosedRounds?.map(
            ({
              round,
              totalContributions,
              roundId,
              hasEndedUnsuccessfully
            }) => {
              return (
                <div key={roundId}>
                  <RoundViewMain
                    roundData={round}
                    raised={totalContributions}
                    roundId={roundId}
                    smallTitle
                    isRoundClosed={true}
                    hasEndedUnsuccessfully={hasEndedUnsuccessfully}
                  />
                </div>
              )
            }
          )}
        </div>
      </>
    </>
  )
}

export default RoundsList
