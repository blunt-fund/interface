import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { Button, NoteText, OwnerBlockToken, Question } from "../"
import BluntDelegate from "abi/BluntDelegate.json"
import executeTransaction from "@utils/executeTransaction"
import { useState } from "react"
import { RoundData } from "@utils/getRounds"
import useNormalizeCurrency from "@utils/useNormalizeCurrency"
import { ethers } from "ethers"
import { useTimeContext } from "../context"

type Props = {
  projectId: number
  bluntDelegate: string
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
    Number(round.deadline) != 0 && Number(round.deadline) - now < 0
  // const isTokenRequiredAndUnset =
  //   round.isSlicerToBeCreated && (!round.tokenName || !round.tokenSymbol)

  const { config, error } = usePrepareContractWrite({
    address: bluntDelegate,
    abi: BluntDelegate.abi,
    functionName: "closeRound",
    args: [],
    overrides: {
      // TODO: Figure out how to automatically correctly estimate it when round is successful
      gasLimit: ethers.BigNumber.from(isTargetReached ? 3500000 : 32000)
    }
  })
  const addRecentTransaction = useAddRecentTransaction()
  const { writeAsync } = useContractWrite(config)

  return (
    <div className="pt-6">
      <div className="w-full px-4 py-6 bg-gray-100 rounded-sm shadow-md sm:px-6">
        <p className="w-full pb-2 text-sm font-bold text-center text-gray-600">
          Project owner section
        </p>

        {/* <OwnerBlockToken
          projectId={projectId}
          bluntDelegate={bluntDelegate}
          round={round}
        /> */}

        <div className="relative flex items-center gap-3 pt-8 pb-6 text-left">
          <div className="flex items-center text-sm xs:text-base">
            <p className="">Wind up round</p>
            <Question
              position="bottom-0 left-[-24px]"
              text={
                <>
                  <p>Closing a round successfully will result in:</p>
                  <ul>
                    <li>
                      Consolidation of the amount raised, preventing further
                      payments or redemptions
                    </li>
                    <li>
                      Ownership transfer of the JB project to your address
                    </li>
                    {/* <li>
                      Round participants being able to claim ownership of the
                      slicer related to the blunt round
                    </li> */}
                  </ul>
                </>
              }
            />
          </div>
          <Button
            label={isTargetReached ? "Finalize" : "Close"}
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
                true
              )
            }
          />
        </div>

        <div className="text-left">
          {
            !isTargetReached ? (
              <NoteText
                error
                text="Closing the round before reaching the target will disable payments, while keeping redemptions enabled"
              />
            ) : null // (
            //   isTokenRequiredAndUnset && (
            //     <NoteText text="Set token name and symbol to finalize round" />
            //   )
            // )
          }
        </div>
      </div>
    </div>
  )
}

export default OwnerBlock
