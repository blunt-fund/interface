import {
  EmissionPreview,
  Locks,
  OwnerBlock,
  PayButton,
  QueueBlock,
  RedeemBlock,
  RoundViewMain
} from "../"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import markdownToHtml from "@lib/markdownToHtml"
import formatRound from "@utils/formatRound"
import { Project } from "@prisma/client"
import Crown from "@components/icons/Crown"
import formatAddress from "@utils/formatAddress"
import { useAppContext } from "../context"

type Props = {
  projectData: Project
  subgraphData: any
  roundInfo: any[]
}

const RoundViewFull = ({ projectData, subgraphData, roundInfo }: Props) => {
  const { account } = useAppContext()
  const router = useRouter()
  const { id } = router.query

  const [roundData, accountContributions] = roundInfo
  const { round, timestamp, totalContributions, isRoundClosed, isQueued } =
    formatRound(subgraphData, roundData, projectData.metadata)

  const totalShares = round.shares.reduce((a, b) => a + b)
  const formatTimestamp = (days: number) =>
    days && (subgraphData.configureEvents[0].timestamp + days * 86400) * 1000

  const [descriptionHtml, setDescriptionHtml] = useState("")
  useEffect(() => {
    const getDescriptionHtml = async (description: string) => {
      setDescriptionHtml(await markdownToHtml(description))
    }

    if (round?.description) {
      getDescriptionHtml(round.description)
    }
  }, [round])

  return (
    <>
      <RoundViewMain
        roundData={round}
        descriptionHtml={descriptionHtml}
        raised={totalContributions}
        timestamp={timestamp}
        issuance={false}
        isRoundClosed={isRoundClosed}
      />

      {!isRoundClosed ? (
        // TODO: Consider also if deadline has passed?
        // If passed + successful prompt "wait for project owner to close"
        // If passed + unsuccessful prompt Full redemptions
        <PayButton
          projectId={Number(id)}
          round={round}
          totalContributions={totalContributions}
          isSlicerToBeCreated={round.isSlicerToBeCreated}
        />
      ) : totalContributions < round.target ? (
        // TODO: Add Full redeem
        <p>Not reached</p>
      ) : (
        round.isSlicerToBeCreated && (
          // TODO: Add claims
          <p>CLAIM</p>
        )
      )}

      {isRoundClosed && totalContributions < round.target ? null : (
        <RedeemBlock
          projectId={Number(id)}
          totalContributions={totalContributions}
          accountContributions={accountContributions}
          tokenIssuance={round.tokenIssuance}
        />
      )}

      {!isRoundClosed && (
        <>
          {!isQueued && (
            <QueueBlock
              projectId={Number(id)}
              bluntDelegate={subgraphData?.configureEvents[0].dataSource}
            />
          )}
          {account == round.projectOwner && (
            <OwnerBlock
              projectId={Number(id)}
              bluntDelegate={subgraphData?.configureEvents[0].dataSource}
              totalContributions={totalContributions}
              isQueued={isQueued}
              round={round}
            />
          )}
        </>
      )}

      <EmissionPreview shares={round?.shares} totalShares={totalShares} />

      <div className="flex items-center justify-center gap-3 pb-4 text-sm">
        <div className="w-4 h-4">
          <Crown />
        </div>
        <p>Project owner: {formatAddress(round.projectOwner)}</p>
      </div>

      <Locks
        transferTimestamp={formatTimestamp(round.transferTimelock)}
        releaseTimestamp={formatTimestamp(round.releaseTimelock)}
        roundTimestamp={round.roundTimelock * 1000}
      />
    </>
  )
}

export default RoundViewFull
