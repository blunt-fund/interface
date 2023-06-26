import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import executeTransaction from "@utils/executeTransaction"
import BluntDelegate from "abi/BluntDelegateClone.json"
import { useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { Button, Question } from ".."

type Props = {
  projectId: number
  bluntDelegate: `0x${string}`
}

const ClaimSlicesButton = ({ projectId, bluntDelegate }: Props) => {
  const [loading, setLoading] = useState(false)

  const { config, error } = usePrepareContractWrite({
    address: bluntDelegate,
    abi: BluntDelegate.abi,
    functionName: "claimSlices",
    args: []
  })
  const addRecentTransaction = useAddRecentTransaction()
  const { writeAsync } = useContractWrite(config)

  return (
    <div className="relative flex items-center gap-3 text-left">
      <div className="flex items-center text-sm xs:text-base">
        <p className="">Claim slices</p>
        <Question
          text={
            <>
              <p>Get ownership of the slicer related to the blunt round.</p>
            </>
          }
        />
      </div>
      <Button
        label="Redeem"
        loading={loading}
        onClick={async () =>
          await executeTransaction(
            writeAsync,
            setLoading,
            `Claim slices | Round ${projectId}`,
            addRecentTransaction,
            null,
            true
          )
        }
      />
    </div>
  )
}

export default ClaimSlicesButton

// TODO: Add batch claim
