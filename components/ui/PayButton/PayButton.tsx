import { Input } from "@components/ui"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import executeTransaction from "@utils/executeTransaction"
import formatNumber from "@utils/formatNumber"
import { addresses } from "@utils/constants"
import { BigNumber, ethers } from "ethers"
import { useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import JBTerminal from "abi/JBETHPaymentTerminal.json"
import { RoundData } from "utils/getRounds"
import { useAppContext } from "../context"
import useNormalizeCurrency from "@utils/useNormalizeCurrency"
import { useEthUsd } from "@utils/useEthUsd"

type Props = {
  projectId: number
  round: RoundData
  totalContributions: number
  isSlicerToBeCreated: boolean
}

const PayButton = ({
  projectId,
  round,
  isSlicerToBeCreated,
  totalContributions
}: Props) => {
  const { account } = useAppContext()
  const ethUsd = useEthUsd()

  const [payment, setPayment] = useState(0)
  const [isPaymentEth, setIsPaymentEth] = useState(true)
  const [loading, setLoading] = useState(false)
  const addRecentTransaction = useAddRecentTransaction()
  const paymentEth = useNormalizeCurrency(payment, isPaymentEth)

  const normalizedCap = useNormalizeCurrency(round.cap, !round.isHardcapUsd)
  const defaultMaxPaymentUsd =
    Math.floor(
      useNormalizeCurrency(
        normalizedCap - totalContributions,
        !isPaymentEth,
        false
      ) * 100
    ) / 100
  const defaultIssuanceUsd =
    Math.floor(useNormalizeCurrency(round.tokenIssuance, isPaymentEth) * 100) /
    100

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
      "Paid from blunt.finance",
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

  const handlTogglePaymentCurrency = () => {
    setIsPaymentEth(!isPaymentEth)
    setPayment(
      isPaymentEth
        ? Math.round(payment * ethUsd)
        : Math.round((payment * 1000) / ethUsd) / 1000
    )
  }

  const { writeAsync } = useContractWrite(config)

  return (
    <div className="pb-6">
      <Input
        type="number"
        onClickLabel="Pay"
        error={error && true}
        min={isPaymentEth ? 0.001 : 1}
        max={
          round.cap
            ? isPaymentEth
              ? defaultMaxPaymentUsd
              : Math.round(defaultMaxPaymentUsd)
            : undefined
        }
        step={isPaymentEth ? 0.001 : 1}
        value={payment || ""}
        onChange={setPayment}
        // placeholder={
        //   round.cap != 0
        //     ? `Up to ${
        //         isPaymentEth
        //           ? defaultMaxPaymentUsd
        //           : Math.round(defaultMaxPaymentUsd)
        //       } ${isPaymentEth ? "ETH" : "USD"}`
        //     : ""
        // }
        prefix={isPaymentEth ? "Ξ" : "$"}
        prefixAction={() => handlTogglePaymentCurrency()}
        loading={loading}
        onClick={async () =>
          payment != 0 &&
          (await executeTransaction(
            writeAsync,
            setLoading,
            `Pay | Round ${projectId}`,
            addRecentTransaction,
            null,
            true
          ),
          setPayment(null))
        }
      />
      <div className="text-left text-xs xs:text-sm pt-1.5">
        {!error ? (
          round.tokenIssuance >= 1 /* || isSlicerToBeCreated */ && (
            <p>
              Receive{" "}
              <span className="font-bold">
                {/* {isSlicerToBeCreated &&
                `${
                  payment
                    ? formatNumber(Math.floor(paymentEth * 1000))
                    : formatNumber(defaultPaymentUsd)
                } slices ${round.tokenIssuance >= 1 ? "+ " : ""}`} */}
                {round.tokenIssuance >= 1 &&
                  `${formatNumber(
                    payment
                      ? Number(
                          Number(paymentEth * round.tokenIssuance).toFixed(0)
                        )
                      : defaultIssuanceUsd,
                    3
                  )} 
                ${round.tokenSymbol || "tokens"} `}
              </span>
              {!payment && (isPaymentEth ? "/ ETH" : "/ USD")}
            </p>
          )
        ) : (
          <p className="font-bold text-red-500">
            {error?.message?.includes("insufficient funds")
              ? "Insufficient funds"
              : "Round cap exceeded"}
          </p>
        )}
      </div>
    </div>
  )
}

export default PayButton
