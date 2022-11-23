import { Input } from "@components/ui"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import executeTransaction from "@utils/executeTransaction"
import formatNumber from "@utils/formatNumber"
import { addresses } from "@utils/constants"
import { BigNumber, ethers } from "ethers"
import { Dispatch, SetStateAction, useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import JBTerminal from "abi/JBETHPaymentTerminal.json"
import { RoundData } from "../CreateRoundForm/CreateRoundForm"
import { useAppContext } from "../context"
import useNormalizeCurrency from "@utils/useNormalizeCurrency"

type Props = {
  projectId: number
  round: RoundData
  payment: number
  isSlicerToBeCreated: boolean
  isPaymentEth: boolean
  setPayment: Dispatch<SetStateAction<number>>
  setIsPaymentEth: Dispatch<SetStateAction<boolean>>
}

const PayButton = ({
  projectId,
  round,
  payment,
  isSlicerToBeCreated,
  isPaymentEth,
  setPayment,
  setIsPaymentEth
}: Props) => {
  const { account } = useAppContext()
  const [loading, setLoading] = useState(false)
  const addRecentTransaction = useAddRecentTransaction()
  const paymentEth = useNormalizeCurrency(payment, isPaymentEth)

  const { config } = usePrepareContractWrite({
    address: addresses.JBTerminal,
    abi: JBTerminal.abi,
    functionName: "pay",
    args: [
      projectId,
      0,
      ethers.constants.AddressZero,
      account,
      0,
      false,
      "Paid from BF",
      []
    ],
    overrides: {
      value:
        payment != 0 &&
        BigNumber.from(10)
          .pow(15)
          .mul(Math.floor(paymentEth * 1000)) // TODO: Write better?
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
            `${
              payment ? formatNumber(Math.floor(paymentEth * 1000)) : "1k"
            } slices ${round.tokenIssuance != 0 ? "+ " : ""}`}
          {round.tokenIssuance != 0 &&
            `${formatNumber(
              payment
                ? Number(Number(paymentEth * round.tokenIssuance).toFixed(0))
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
