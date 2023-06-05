import { ClaimSlicesButton, FullRedeemButton, PayButton, RedeemBlock } from ".."
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { BigNumber, ethers } from "ethers"
import { RoundData } from "@utils/getRounds"
import { useTimeContext } from "../context"
import useNormalizeCurrency from "@utils/useNormalizeCurrency"

type Props = {
  round: RoundData
  totalContributions: number
  isRoundClosed: boolean
  accountContributions: BigNumber
  bluntDelegate: string
}

const RoundMainSection = ({
  round,
  totalContributions,
  isRoundClosed,
  accountContributions,
  bluntDelegate
}: Props) => {
  const { now } = useTimeContext()
  const router = useRouter()
  const { id } = router.query

  const isDeadlinepassed =
    Number(round.deadline) != 0 && Number(round.deadline) - now < 0

  const normalizedTarget = useNormalizeCurrency(
    round.target,
    !round.isTargetUsd
  )

  const [accountHasContributed, setAccountHasContributed] = useState(false)

  useEffect(() => {
    if (accountContributions) {
      setAccountHasContributed(
        Number(ethers.utils.formatEther(accountContributions)) != 0
      )
    } else {
      setAccountHasContributed(false)
    }
  }, [accountContributions])

  // TODO: Best way to not hide FullRedeemButton after full redeem? Example: http://localhost:3000/rounds/332
  // - update account contributions onchain also if round is closed
  // - get value from JB?
  // - ????

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
        totalContributions <= normalizedTarget && (
          <FullRedeemButton
            projectId={Number(id)}
            accountContributions={accountContributions}
          />
        )
        //  round.isSlicerToBeCreated && !isRoundClosed ? (
        //   <p className="text-sm font-bold text-yellow-600">
        //     Wait for the project owner to close the round to claim your slices
        //   </p>
        // ) : (
        //   <ClaimSlicesButton
        //     projectId={Number(id)}
        //     bluntDelegate={bluntDelegate}
        //   />
        // )
      )}

      {isDeadlinepassed ||
      (isRoundClosed && totalContributions <= round.target) ||
      !accountHasContributed ? null : (
        <RedeemBlock
          projectId={Number(id)}
          totalContributions={totalContributions}
          accountContributions={accountContributions}
          tokenIssuance={round.tokenIssuance}
          isRedeemDisabled={isRoundClosed && totalContributions > round.target}
        />
      )}
    </>
  )
}

export default RoundMainSection
