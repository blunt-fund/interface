import formatNumber from "@utils/formatNumber"
import { RoundData } from "@utils/getRounds"
import useNormalizeCurrency from "@utils/useNormalizeCurrency"
import React from "react"
import { useTimeContext } from "../context"
import ProgressBar from "../ProgressBar"

type Props = {
  roundData: RoundData
  raised: number
  timestamp: number
  issuance: boolean
  isRoundClosed: boolean
}

const RoundDetails = ({
  roundData,
  raised,
  timestamp,
  issuance,
  isRoundClosed
}: Props) => {
  const { now } = useTimeContext()
  const {
    tokenSymbol,
    tokenIssuance,
    deadline,
    target,
    cap,
    isTargetUsd,
    isCapUsd
  } = roundData

  const currency = (isUsd: boolean) => (isUsd ? "USD" : "ETH")
  const targetEth = useNormalizeCurrency(target, !isTargetUsd)
  const capEth = useNormalizeCurrency(cap, !isCapUsd)
  const normalizedRaisedUsd = useNormalizeCurrency(raised, true, false)
  const raisedUsd = raised != 0 ? normalizedRaisedUsd || undefined : 0
  const timeLeft = typeof deadline == "number" ? deadline - now : undefined
  const formattedTimeLeftUnits =
    timeLeft && timeLeft / 86400 > 1
      ? "days"
      : timeLeft / 3600 > 1
      ? "hours"
      : timeLeft / 60 > 1
      ? "minutes"
      : "seconds"
  const formattedTimeLeft =
    timeLeft &&
    Math.floor(
      formattedTimeLeftUnits == "days"
        ? timeLeft / 86400
        : formattedTimeLeftUnits == "hours"
        ? timeLeft / 3600
        : formattedTimeLeftUnits == "minutes"
        ? timeLeft / 60
        : timeLeft
    )
  const active = (deadline == 0 || timeLeft > 0) && !isRoundClosed

  return (
    <div className="mt-8 text-xs xs:text-sm">
      <ProgressBar
        max={
          cap != 0
            ? capEth
            : raised < targetEth
            ? targetEth * 1.5
            : raised * 1.25
        }
        target={targetEth}
        raised={raised}
        isCapped={cap != 0}
        active={active}
      />
      <div className="flex justify-between pt-5 pb-2">
        <p>
          Raised:{" "}
          <b>
            <span
              className={
                raised <= targetEth
                  ? "text-yellow-500 dark:text-yellow-300"
                  : "text-green-600 nightwind prevent"
              }
            >
              {formatNumber(!isCapUsd ? raised : raisedUsd, 1)}
            </span>{" "}
            {cap != 0 && `/ ${formatNumber(cap, 1)}`}{" "}
            {currency(isCapUsd || !cap)}
          </b>
        </p>
        <p>
          Deadline:{" "}
          <b
            className={
              timeLeft > 0 && timeLeft < 259200 ? "text-yellow-500" : ""
            }
          >
            {deadline && deadline != 0
              ? timeLeft
                ? timeLeft > 0
                  ? `${formattedTimeLeft} ${formattedTimeLeftUnits}`
                  : "passed"
                : `${deadline} days`
              : "none"}
          </b>
        </p>
      </div>
      <div className="flex justify-between">
        <p>
          {target != 0 && (
            <>
              Target:{" "}
              <b>
                <span className="text-blue-600">{formatNumber(target, 1)}</span>{" "}
                {currency(isTargetUsd)}
              </b>
            </>
          )}
        </p>
        {issuance && tokenIssuance >= 1 && (
          <p>
            Issuance:{" "}
            <b>
              {formatNumber(tokenIssuance, 1)} {tokenSymbol || "tokens"} / ETH
            </b>
          </p>
        )}
      </div>
    </div>
  )
}

export default RoundDetails
