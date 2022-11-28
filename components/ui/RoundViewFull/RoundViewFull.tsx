import RoundViewMain from "../RoundViewMain"
import PayButton from "../PayButton"
import Locks from "../Locks"
import EmissionPreview from "../EmissionPreview"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import markdownToHtml from "@lib/markdownToHtml"
import useNow from "@utils/useNow"
import formatRound from "@utils/formatRound"

type Props = {
  projectData: any
  subgraphData: any
  roundInfo: any
}

const RoundViewFull = ({ projectData, subgraphData, roundInfo }: Props) => {
  const now = Math.floor(useNow() / 1000)
  const router = useRouter()
  const { id } = router.query
  const { round, deadline, totalContributions, duration, isRoundClosed } =
    formatRound(subgraphData, roundInfo, projectData.metadata)

  const [descriptionHtml, setDescriptionHtml] = useState("")

  useEffect(() => {
    const getDescriptionHtml = async (description: string) => {
      setDescriptionHtml(await markdownToHtml(description))
    }

    if (round?.description) {
      getDescriptionHtml(round.description)
    }
  }, [round])

  const totalShares = round.shares.reduce((a, b) => a + b)
  const formatTimestamp = (days: number) =>
    days && (subgraphData.configureEvents[0].timestamp + days * 86400) * 1000

  return (
    <>
      <RoundViewMain
        roundData={round}
        descriptionHtml={descriptionHtml}
        raised={totalContributions}
        deadline={deadline}
        issuance={false}
      />

      <PayButton
        projectId={Number(id)}
        round={round}
        isSlicerToBeCreated={round.isSlicerToBeCreated || round?.shares[0] != 0}
      />

      <EmissionPreview shares={round?.shares} totalShares={totalShares} />

      <Locks
        transferTimestamp={formatTimestamp(round.transferTimelock)}
        releaseTimestamp={formatTimestamp(round.releaseTimelock)}
        roundTimestamp={formatTimestamp(round.roundTimelock)}
      />

      {/* TODO: Add "Contributed" section */}
    </>
  )
}

export default RoundViewFull
