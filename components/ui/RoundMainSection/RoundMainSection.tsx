import { ClaimSlicesButton, FullRedeemButton, PayButton, RedeemBlock } from ".."
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { BigNumber, ethers } from "ethers"
import { RoundData } from "@utils/getRounds"
import { useTimeContext } from "../context"

type Props = {
  round: RoundData
  totalContributions: number
  isRoundClosed: boolean
  timestamp?: number
  accountContributions: BigNumber
  bluntDelegate: string
}

const RoundMainSection = ({
  round,
  totalContributions,
  isRoundClosed,
  timestamp,
  accountContributions,
  bluntDelegate
}: Props) => {
  const { now } = useTimeContext()
  const router = useRouter()
  const { id } = router.query

  const isDeadlinepassed = timestamp + round.duration - now < 0

  const [accountHasContributed, setAccountHasContributed] = useState(false)
  useEffect(() => {
    setAccountHasContributed(
      Number(ethers.utils.formatEther(accountContributions)) != 0
    )
  }, [accountContributions])

  return (
    <>
      {!isRoundClosed && !isDeadlinepassed ? (
        <PayButton
          projectId={Number(id)}
          round={round}
          totalContributions={totalContributions}
          isSlicerToBeCreated={round.isSlicerToBeCreated}
        />
      ) : (
        accountHasContributed &&
        (totalContributions <= round.target ? (
          <FullRedeemButton
            projectId={Number(id)}
            accountContributions={accountContributions}
          />
        ) : round.isSlicerToBeCreated && !isRoundClosed ? (
          <p className="text-sm font-bold text-yellow-600">
            Wait for the project owner to close the round to claim your slices
          </p>
        ) : (
          <ClaimSlicesButton
            projectId={Number(id)}
            bluntDelegate={bluntDelegate}
          />
        ))
      )}

      {isDeadlinepassed ||
      (isRoundClosed && totalContributions <= round.target) ||
      !accountHasContributed ? null : (
        <RedeemBlock
          projectId={Number(id)}
          totalContributions={totalContributions}
          accountContributions={accountContributions}
          tokenIssuance={round.tokenIssuance}
        />
      )}
    </>
  )
}

export default RoundMainSection
