import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { Button, Input, InputDeadlineUnits, NoteText } from ".."
import BluntDelegate from "abi/BluntDelegate.json"
import executeTransaction from "@utils/executeTransaction"
import { useState } from "react"
import { useTimeContext } from "../context"
import { timeFrames } from "../InputDeadlineUnits/InputDeadlineUnits"

type Props = {
  projectId: number
  bluntDelegate: `0x${string}`
}

const OwnerBlockSetDeadline = ({ projectId, bluntDelegate }: Props) => {
  const { now } = useTimeContext()
  const [newDeadline, setNewDeadline] = useState(0)
  const [deadlineUnits, setDeadlineUnits] = useState("days")
  const [loadingSetDeadline, setLoadingSetDeadline] = useState(false)
  const formattedNewDeadline = newDeadline
    ? now + newDeadline * timeFrames[deadlineUnits]
    : 0

  const addRecentTransaction = useAddRecentTransaction()
  const { config: configSetDeadline } = usePrepareContractWrite({
    address: bluntDelegate,
    abi: BluntDelegate.abi,
    functionName: "setDeadline",
    args: [formattedNewDeadline]
  })
  const { writeAsync: writeAsyncSetDeadline } =
    useContractWrite(configSetDeadline)

  return (
    <>
      <div className="relative flex items-end gap-4">
        <div className="flex-grow">
          <Input
            type="number"
            label="Round duration"
            min={0}
            value={newDeadline || ""}
            onChange={setNewDeadline}
            loading={loadingSetDeadline}
            question={
              <>
                <p>The period of time in which contributions are accepted.</p>
                <NoteText text="You cannot change this later." />
              </>
            }
          />
        </div>
        <InputDeadlineUnits
          deadlineUnits={deadlineUnits}
          setDeadlineUnits={setDeadlineUnits}
        />
      </div>
      <div className="pt-8">
        <Button
          onClick={async () =>
            await executeTransaction(
              writeAsyncSetDeadline,
              setLoadingSetDeadline,
              `Set deadline | Round ${projectId}`,
              addRecentTransaction
            )
          }
          label="Set deadline"
          disabled={!Number(newDeadline)}
          loading={loadingSetDeadline}
        />
      </div>
      <hr className="w-20 !my-12 mx-auto border-gray-300" />
    </>
  )
}

export default OwnerBlockSetDeadline
