import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { Input, NoteText } from ".."
import BluntDelegate from "abi/BluntDelegate.json"
import executeTransaction from "@utils/executeTransaction"
import { useState } from "react"
import { useTimeContext } from "../context"

type Props = {
  projectId: number
  bluntDelegate: string
}

const OwnerBlockSetDeadline = ({ projectId, bluntDelegate }: Props) => {
  const { now } = useTimeContext()
  const [newDeadline, setNewDeadline] = useState(0)
  const [loadingSetDeadline, setLoadingSetDeadline] = useState(false)
  const formattedNewDeadline = newDeadline ? now + newDeadline * 86400 : 0

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
      <Input
        type="number"
        label="Round duration (days)"
        min={0}
        value={newDeadline || ""}
        onChange={setNewDeadline}
        question={
          <>
            <p>The period of time in which contributions are accepted.</p>
            <NoteText text="You cannot change this later." />
          </>
        }
        loading={loadingSetDeadline}
        onClick={async () =>
          await executeTransaction(
            writeAsyncSetDeadline,
            setLoadingSetDeadline,
            `Set deadline | Round ${projectId}`,
            addRecentTransaction
          )
        }
        onClickLabel="Set deadline"
      />
      <hr className="w-20 !my-12 mx-auto border-gray-300" />
    </>
  )
}

export default OwnerBlockSetDeadline
