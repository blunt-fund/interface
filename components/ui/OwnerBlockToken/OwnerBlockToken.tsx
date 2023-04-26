import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import Button from "../Button"
import Question from "../Question"
import BluntDelegate from "abi/BluntDelegateClone.json"
import executeTransaction from "@utils/executeTransaction"
import { useState } from "react"
import { RoundData } from "@utils/getRounds"
import Input from "../Input"
import handleSetObject from "@utils/handleSetObject"

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
        <p className="text-sm text-left">Token metadata</p>
        <Question
          position="bottom-0 left-[-24px]"
          text={
            <p>
              Set the name and symbol of the ERC20 token associated with the
              Juicebox project related to the blunt round.
            </p>
          }
        />
      </div>
      <div className="flex flex-col gap-2 xs:flex-row">
        <div className="flex-grow">
          <Input
            type="string"
            value={tokenData.tokenName}
            onChange={handleSetTokenName}
            placeholder={tokenName || "Blunt finance"}
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
