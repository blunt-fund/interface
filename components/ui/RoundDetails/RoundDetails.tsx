import formatNumber from "@utils/formatNumber"
import { RoundData } from "@utils/getRounds"
import useNormalizeCurrency from "@utils/useNormalizeCurrency"
import React from "react"
import { useTimeContext } from "../context"
import ProgressBar from "../ProgressBar"

type Props = {
  roundData: RoundData
  raised: number
  issuance: boolean
  isRoundClosed: boolean
  hasEndedUnsuccessfully: boolean
}

const RoundDetails = ({
  roundData,
  raised,
  issuance,
  isRoundClosed,
  hasEndedUnsuccessfully
}: Props) => {
  const { now } = useTimeContext()
  const {
    tokenSymbol,
    tokenIssuance,
    deadline,
    target,
    cap,
    isTargetUsd,
    isHardcapUsd
  } = roundData

  const currency = (isUsd: boolean) => (isUsd ? "USD" : "ETH")
  const targetEth = useNormalizeCurrency(target, !isTargetUsd)
  const capEth = useNormalizeCurrency(cap, !isHardcapUsd)
  const normalizedRaisedUsd = useNormalizeCurrency(raised, true, false)
  const raisedUsd =
    raised != 0 ? Math.floor(normalizedRaisedUsd) || undefined : 0
  const timeLeft =
    typeof deadline == "string" ? Number(deadline) : Number(deadline) - now
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
  const active = (Number(deadline) == 0 || timeLeft > 0) && !isRoundClosed

  return (
    <div className="mt-6 text-sm tracking-tight sm:tracking-normal">
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
        hasEndedUnsuccessfully={hasEndedUnsuccessfully}
      />
      <div className="flex justify-between pt-5 pb-2">
        <p>
          Raised:{" "}
          <b>
            <span
              className={
                raised <= targetEth || hasEndedUnsuccessfully
                  ? "text-yellow-500 dark:text-yellow-300"
                  : "text-green-600 nightwind prevent"
              }
            >
              {formatNumber(isHardcapUsd || !cap ? raisedUsd : raised, 1)}
            </span>{" "}
            {cap != 0 && `/ ${formatNumber(cap, 1)}`}{" "}
            {currency(isHardcapUsd || !cap)}
          </b>
        </p>
        <p>
          Deadline:{" "}
          <b
            className={
              timeLeft > 0 && timeLeft < 259200 ? "text-yellow-500" : ""
            }
          >
            {deadline && Number(deadline) != 0
              ? typeof deadline != "string"
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
            Tokens:{" "}
            <b>
              {formatNumber(tokenIssuance, 1)} {tokenSymbol || ""}/ ETH
            </b>
          </p>
        )}
      </div>
    </div>
  )
}

export default RoundDetails
