import { Input } from "@components/ui"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import executeTransaction from "@utils/executeTransaction"
import formatNumber from "@utils/formatNumber"
import { addresses } from "@utils/constants"
import { BigNumber, ethers } from "ethers"
import { Dispatch, SetStateAction, useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import JBTerminal from "abi/JBETHPaymentTerminal.json"
import { RoundData } from "utils/formatRoundInfo"
import { useAppContext } from "../context"
import useNormalizeCurrency from "@utils/useNormalizeCurrency"

type Props = {
  projectId: number
  round: RoundData
  isSlicerToBeCreated: boolean
}

const PayButton = ({ projectId, round, isSlicerToBeCreated }: Props) => {
  const { account } = useAppContext()

  const [payment, setPayment] = useState(0)
  const [isPaymentEth, setIsPaymentEth] = useState(true)
  const [loading, setLoading] = useState(false)
  const addRecentTransaction = useAddRecentTransaction()
  const paymentEth = useNormalizeCurrency(payment, isPaymentEth)

  const { config, error } = usePrepareContractWrite({
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
  const isError = error && true

  return (
    <div className="pb-6">
      <Input
        type="number"
        onClickLabel="Pay"
        error={isError}
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
      <div className="text-left text-xs xs:text-sm pt-1.5">
        {!isError ? (
          <p>
            Receive{" "}
            <span className="font-bold text-blue-600">
              {isSlicerToBeCreated &&
                `${
                  payment ? formatNumber(Math.floor(paymentEth * 1000)) : "1k"
                } slices ${round.tokenIssuance != 0 ? "+ " : ""}`}
              {round.tokenIssuance != 0 &&
                `${formatNumber(
                  payment
                    ? Number(
                        Number(paymentEth * round.tokenIssuance).toFixed(0)
                      )
                    : round.tokenIssuance,
                  3
                )} 
                ${round.tokenSymbol} `}
            </span>
            {!payment && (isPaymentEth ? "/ ETH" : "/ USD")}
          </p>
        ) : (
          <p className="font-bold text-red-500">Insufficient funds</p>
        )}
      </div>
    </div>
  )
}

export default PayButton
