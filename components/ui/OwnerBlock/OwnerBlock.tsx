import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import executeTransaction from "@utils/executeTransaction"
import { RoundData } from "@utils/getRounds"
import useNormalizeCurrency from "@utils/useNormalizeCurrency"
import BluntDelegate from "abi/BluntDelegateClone.json"
import { ethers } from "ethers"
import { useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { Button, NoteText, OwnerBlockSetDeadline, OwnerBlockToken } from "../"
import { useTimeContext } from "../context"

type Props = {
  projectId: number
  bluntDelegate: `0x${string}`
  totalContributions: number
  round: RoundData
}

const OwnerBlock = ({
  totalContributions,
  projectId,
  bluntDelegate,
  round
}: Props) => {
  const { now } = useTimeContext()
  const [loading, setLoading] = useState(false)

  const targetEth = useNormalizeCurrency(round.target, !round.isTargetUsd)
  const isTargetReached = totalContributions > targetEth
  const isDeadlinepassed =
    Number(round.deadline) == 0 || Number(round.deadline) - now < 0
  // const isTokenRequiredAndUnset =
  //   round.isSlicerToBeCreated && (!round.tokenName || !round.tokenSymbol)

  const addRecentTransaction = useAddRecentTransaction()
  const { config, error } = usePrepareContractWrite({
    address: bluntDelegate,
    abi: BluntDelegate.abi,
    functionName: "closeRound",
    args: [],
    overrides: {
      // TODO: Figure out how to automatically correctly estimate it when round is successful
      gasLimit: isTargetReached ? ethers.BigNumber.from(720000) : undefined
    }
  })
  const { writeAsync } = useContractWrite(config)

  return (
    <div className="pt-6">
      <div className="w-full rounded-sm px-4 pt-6 pb-10 shadow-md bg-gray-100 sm:px-6">
        <p className="pb-6 text-center text-sm font-bold text-gray-500">
          Project owner
        </p>
        <div className="space-y-2">
          <OwnerBlockToken
            projectId={projectId}
            bluntDelegate={bluntDelegate}
            round={round}
          />

          {Number(round.deadline) == 0 && (
            <OwnerBlockSetDeadline
              projectId={projectId}
              bluntDelegate={bluntDelegate}
            />
          )}
        </div>
        <hr className="!my-12 mx-auto w-20 border-gray-300" />

        <div className="prose-sm text-left prose">
          <p>Finalize a round after reaching the fundraise target to:</p>
          <ul className="pb-1">
            <li>
              Consolidate the amount raised, preventing further payments or
              redemptions.
            </li>
            <li>
              Claim ownership of the project, and manage funds on Juicebox
            </li>
            {/* <li>
              Round participants being able to claim ownership of the
              slicer related to the blunt round
            </li> */}
          </ul>
          {
            !isTargetReached ? (
              <NoteText
                error
                text="Closing the round before reaching the target will permanently disable contributions, only allowing refunds"
              />
            ) : (
              !isDeadlinepassed && (
                <NoteText text="You need to wait for the deadline to pass before finalizing the round" />
              )
            )
            // (
            //   isTokenRequiredAndUnset && (
            //     <NoteText text="Set token name and symbol to finalize round" />
            //   )
            // )
          }
        </div>

        <div className="relative flex items-center justify-center gap-3 pt-6 text-left">
          <Button
            label={isTargetReached ? "Finalize round" : "Close round"}
            customClassName="overflow-hidden font-bold tracking-wide rounded-sm min-w-[260px]"
            customColor={
              !isTargetReached
                ? "text-white bg-red-500 hover:bg-red-600 focus:bg-red-600"
                : null
            }
            loading={loading}
            disabled={
              isTargetReached &&
              !isDeadlinepassed /* && isTokenRequiredAndUnset */
            }
            onClick={async () =>
              await executeTransaction(
                writeAsync,
                setLoading,
                `Close round | Round ${projectId}`,
                addRecentTransaction,
                null,
                isTargetReached
              )
            }
          />
        </div>
      </div>
    </div>
  )
}

export default OwnerBlock
