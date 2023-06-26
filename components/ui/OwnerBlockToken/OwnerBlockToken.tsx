import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import executeTransaction from "@utils/executeTransaction"
import { RoundData } from "@utils/getRounds"
import handleSetObject from "@utils/handleSetObject"
import BluntDelegate from "abi/BluntDelegateClone.json"
import { useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import Button from "../Button"
import Input from "../Input"
import Question from "../Question"

type Props = {
  projectId: number
  bluntDelegate: `0x${string}`
  round: RoundData
}

const OwnerBlockToken = ({ projectId, bluntDelegate, round }: Props) => {
  const { tokenName, tokenSymbol } = round
  const [tokenData, setTokenData] = useState({ tokenName, tokenSymbol })
  const [loading, setLoading] = useState(false)
  const { config, error } = usePrepareContractWrite({
    address: bluntDelegate,
    abi: BluntDelegate.abi,
    functionName: "setTokenMetadata",
    args: [tokenData.tokenName, tokenData.tokenSymbol]
  })
  const addRecentTransaction = useAddRecentTransaction()
  const { writeAsync } = useContractWrite(config)

  const handleSetTokenName = (value: string) => {
    handleSetObject("tokenName", value, tokenData, setTokenData)
  }

  const handleSetTokenSymbol = (value: string) => {
    handleSetObject("tokenSymbol", value.toUpperCase(), tokenData, setTokenData)
  }

  return (
    <>
      <div className="relative flex items-center">
        <p className="text-left text-sm">Project Token</p>
        <Question
          position="bottom-0 left-[-24px]"
          text={
            <>
              <p>
                Set the name and symbol of the ERC20 token associated with your
                project.
              </p>
              <p>
                The ERC20 token will be deployed once the round is closed
                successfully.
              </p>
            </>
          }
        />
      </div>
      <div className="flex flex-col gap-2 xs:flex-row">
        <div className="flex-grow">
          <Input
            type="string"
            value={tokenData.tokenName}
            onChange={handleSetTokenName}
            placeholder={tokenName || "Blunt"}
          />
        </div>
        <div className="xs:w-36">
          <Input
            type="string"
            value={tokenData.tokenSymbol}
            onChange={handleSetTokenSymbol}
            placeholder={tokenSymbol || "BLUNT"}
          />
        </div>
        <Button
          label="Set token"
          loading={loading}
          onClick={async () =>
            await executeTransaction(
              writeAsync,
              setLoading,
              `Set token | Round ${projectId}`,
              addRecentTransaction,
              null,
              true
            )
          }
        />
      </div>
    </>
  )
}

export default OwnerBlockToken
