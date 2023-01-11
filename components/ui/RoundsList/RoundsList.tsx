import { MySwitch, RoundViewMain, RoundViewMainLoading } from "@components/ui"
import getRounds, { RoundInfo } from "@utils/getRounds"
import { useContractReads } from "wagmi"
import bluntDelegate from "abi/BluntDelegate.json"
import { Project } from "@prisma/client"
import { useState } from "react"
import useSWR from "swr"
import fetcher from "@utils/fetcher"

type Props = {
  projectData: Project[]
  subgraphData: any
  accountFilter?: string
}

const RoundsList = ({ projectData, subgraphData, accountFilter }: Props) => {
  const [onlySuccess, setOnlySuccess] = useState(true)

  const { data: ethUsd } = useSWR("/api/getEthUsd", fetcher)

  const {
    data: roundInfo,
    isError,
    isLoading
  } = useContractReads({
    contracts: subgraphData?.map((project) => ({
      address:
        project.configureEvents[project.configureEvents.length - 1].dataSource,
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

  const getAccountRounds = (rounds: RoundInfo[]) =>
    accountFilter
      ? rounds?.filter((el) => el.round.projectOwner == accountFilter)
      : rounds

  let filteredActiveRounds = getAccountRounds(activeRounds)
  let filteredClosedRounds = getAccountRounds(closedRounds)

  if (onlySuccess) {
    filteredClosedRounds = filteredClosedRounds.filter((el) => {
      const targetEth = !el.round.isTargetUsd
        ? el.round.target
        : el.round.target / Number(ethUsd)
      return el.totalContributions > targetEth
    })
  }

  return !roundInfo || !subgraphData ? (
    <div className="space-y-20">
      {[...Array(3)].map((el, key) => (
        <RoundViewMainLoading key={key} />
      ))}
    </div>
  ) : (
    <>
      <div className="space-y-20">
        {filteredActiveRounds?.map(({ round, totalContributions, roundId }) => {
          return (
            <div key={roundId}>
              <RoundViewMain
                roundData={round}
                raised={totalContributions}
                roundId={roundId}
                smallTitle
                isRoundClosed={false}
              />
            </div>
          )
        })}
      </div>
      {filteredClosedRounds.length != 0 && (
        <>
          <div className="pt-20 pb-12">
            <h1 className="pb-12">Closed rounds</h1>
            <MySwitch
              label="Show only successful rounds"
              enabled={onlySuccess}
              setEnabled={setOnlySuccess}
              alignRight
            />
          </div>
          <div className="space-y-20">
            {filteredClosedRounds?.map(
              ({ round, totalContributions, roundId }) => {
                return (
                  <div key={roundId}>
                    <RoundViewMain
                      roundData={round}
                      raised={totalContributions}
                      roundId={roundId}
                      smallTitle
                      isRoundClosed={true}
                    />
                  </div>
                )
              }
            )}
          </div>
        </>
      )}
    </>
  )
}

export default RoundsList
