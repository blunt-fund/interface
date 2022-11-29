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
    duration,
    target,
    cap,
    isTargetEth,
    isCapEth
  } = roundData

  const currency = (isEth: boolean) => (isEth ? "ETH" : "USD")
  const targetEth = useNormalizeCurrency(target, isTargetEth)
  const capEth = useNormalizeCurrency(cap, isCapEth)
  const normalizedRaisedUsd = useNormalizeCurrency(raised, true, false)
  const raisedUsd = raised != 0 ? normalizedRaisedUsd || undefined : 0
  const deadline = timestamp + duration - now
  const formattedDeadlineUnits =
    deadline / 86400 > 1
      ? "days"
      : deadline / 3600 > 1
      ? "hours"
      : deadline / 60 > 1
      ? "minutes"
      : "seconds"
  const formattedDeadline =
    deadline &&
    Math.floor(
      formattedDeadlineUnits == "days"
        ? deadline / 86400
        : formattedDeadlineUnits == "hours"
        ? deadline / 3600
        : formattedDeadlineUnits == "minutes"
        ? deadline / 60
        : deadline
    )
  const active = (duration == 0 || deadline > 0) && !isRoundClosed

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
                raised < targetEth
                  ? "text-yellow-500 dark:text-yellow-300"
                  : "text-blue-600 nightwind prevent"
              }
            >
              {formatNumber(isCapEth ? raised : raisedUsd, 1)}
            </span>{" "}
            {cap != 0 && `/ ${formatNumber(cap, 1)}`}{" "}
            {currency(isCapEth || !cap)}
          </b>
        </p>
        <p>
          Deadline:{" "}
          <b
            className={
              deadline > 0 && deadline < 259200 ? "text-yellow-500" : ""
            }
          >
            {duration
              ? deadline != undefined
                ? deadline > 0
                  ? `${formattedDeadline} ${formattedDeadlineUnits}`
                  : "passed"
                : `${duration} days`
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
                {currency(isTargetEth)}
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
