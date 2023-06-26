import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import executeTransaction from "@utils/executeTransaction"
import BluntDelegate from "abi/BluntDelegateClone.json"
import { useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import Button from "../Button"
import Question from "../Question"

type Props = { projectId: number; bluntDelegate: `0x${string}` }

const QueueBlock = ({ projectId, bluntDelegate }: Props) => {
  const [loading, setLoading] = useState(false)
  const { config, error } = usePrepareContractWrite({
    address: bluntDelegate,
    abi: BluntDelegate.abi,
    functionName: "queueNextPhase",
    args: []
  })
  const addRecentTransaction = useAddRecentTransaction()
  const { writeAsync } = useContractWrite(config)

  return (
    <div className="relative flex items-center gap-4 text-left">
      <div className="flex items-center">
        <p className="">Prepare round</p>
        <Question
          text={
            <>
              <p>
                In order to finalize rounds immediately after the deadline, an
                additional transaction needs to be executed while the round is
                in progress.
              </p>
              <p>Rounds only need to be queued once.</p>
            </>
          }
        />
      </div>
      <Button
        label="Queue stage"
        loading={loading}
        onClick={async () =>
          await executeTransaction(
            writeAsync,
            setLoading,
            `Queue stage | Round ${projectId}`,
            addRecentTransaction,
            null,
            true
          )
        }
      />
    </div>
  )
}

export default QueueBlock
