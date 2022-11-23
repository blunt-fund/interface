import { Input } from "@components/ui"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import executeTransaction from "@utils/executeTransaction"
import formatNumber from "@utils/formatNumber"
import { ethers } from "ethers"
import { Dispatch, SetStateAction, useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"

type Props = {
  round: any
  payment: number
  isSlicerToBeCreated: boolean
  isPaymentEth: boolean
  setPayment: Dispatch<SetStateAction<number>>
  setIsPaymentEth: Dispatch<SetStateAction<boolean>>
}

const PayButton = ({
  round,
  payment,
  isSlicerToBeCreated,
  isPaymentEth,
  setPayment,
  setIsPaymentEth
}: Props) => {
  const [loading, setLoading] = useState(false)
  const addRecentTransaction = useAddRecentTransaction()
  const { config } = usePrepareContractWrite({
    addressOrName: "JBTerminal",
    contractInterface: "",
    functionName: "pay",
    args: [],
    overrides: {
      value: payment // TODO: FIX
    }
  })

  const { writeAsync } = useContractWrite(config)

  return (
    <div className="pb-6">
      <Input
        type="number"
        onClickLabel="Pay"
        min={0}
        value={payment || ""}
        onChange={setPayment}
        prefix={isPaymentEth ? "Ξ" : "$"}
        prefixAction={() => setIsPaymentEth(!isPaymentEth)}
        loading={loading}
        onClick={async () =>
          await executeTransaction(
            writeAsync,
            setLoading,
            `Pay ${round.name}`,
            addRecentTransaction
          )
        }
      />
      <p className="pt-1.5 text-xs xs:text-sm text-left">
        Receive{" "}
        <span className="font-bold text-blue-600">
          {isSlicerToBeCreated &&
            `1k slices ${round.tokenIssuance != 0 ? "+ " : ""}`}
          {round.tokenIssuance != 0 &&
            `${formatNumber(
              payment
                ? Number(Number(payment * round.tokenIssuance).toFixed(0))
                : round.tokenIssuance,
              3
            )} 
                ${round.tokenSymbol} `}
        </span>
        {!payment && (isPaymentEth ? "/ ETH" : "/ USD")}
      </p>
    </div>
  )
}

export default PayButton
