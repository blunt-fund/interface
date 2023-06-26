import { Input } from "@components/ui"
import {
  useAddRecentTransaction,
  useConnectModal
} from "@rainbow-me/rainbowkit"
import { addresses } from "@utils/constants"
import executeTransaction from "@utils/executeTransaction"
import formatNumber from "@utils/formatNumber"
import { useEthUsd } from "@utils/useEthUsd"
import useNormalizeCurrency from "@utils/useNormalizeCurrency"
import JBTerminal from "abi/JBETHPaymentTerminal.json"
import { ethers } from "ethers"
import { useState } from "react"
import { RoundData } from "utils/getRounds"
import { parseEther } from "viem"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { useAppContext } from "../context"

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
  const { account, isConnected } = useAppContext()
  const { openConnectModal } = useConnectModal()
  const ethUsd = useEthUsd()

  const [payment, setPayment] = useState(0)
  const [isPaymentEth, setIsPaymentEth] = useState(true)
  const [loading, setLoading] = useState(false)
  const addRecentTransaction = useAddRecentTransaction()
  const paymentEth = useNormalizeCurrency(Number(payment), isPaymentEth)

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
  const isToggleCurrencyEnabled = process.env.NEXT_PUBLIC_CHAIN_ID === "1"

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
      "Paid from blunt.fund",
      []
    ],
    value: parseEther((Math.floor(paymentEth * 1e5) / 1e5).toString())
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
      <div className="relative">
        <Input
          type="number"
          onClickLabel={isConnected ? "Pay" : "Connect"}
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
          prefixAction={() =>
            isToggleCurrencyEnabled && handlTogglePaymentCurrency()
          }
          loading={loading}
          onClick={async () => {
            if (!isConnected) {
              openConnectModal()
            } else if (payment != 0) {
              await executeTransaction(
                writeAsync,
                setLoading,
                `Pay ${round.name} | #${projectId}`,
                addRecentTransaction,
                async () => setPayment(null),
                true
              )
            }
          }}
        />
        {isToggleCurrencyEnabled && payment ? (
          <p
            className={`absolute top-0 ${
              isConnected ? "right-[140px]" : "right-[176px]"
            } flex h-full items-center text-sm text-gray-600`}
          >
            {isPaymentEth
              ? `$${Math.round(payment * ethUsd)}`
              : `Ξ${Math.round((payment * 1000) / ethUsd) / 1000}`}
          </p>
        ) : null}
      </div>
      <div className="pt-1.5 text-left text-xs xs:text-sm">
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
