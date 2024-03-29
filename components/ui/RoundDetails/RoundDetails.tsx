import formatNumber from "@utils/formatNumber"
import { RoundData } from "@utils/getRounds"
import useNormalizeCurrency from "@utils/useNormalizeCurrency"
import React, { useEffect, useState } from "react"
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
  const [raisedUsd, setRaisedUsd] = useState<number>()
  const [targetEth, setTargetEth] = useState<number>()
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

  const isCurrencyUsd = (isUsd: boolean) => (isUsd ? "USD" : "ETH")
  const normalizedTargetEth = useNormalizeCurrency(target, !isTargetUsd)
  const capEth = useNormalizeCurrency(cap, !isHardcapUsd)
  const normalizedRaisedUsd = useNormalizeCurrency(raised, true, false)

  const timeLeft = Number(deadline) - now
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

  useEffect(() => {
    setRaisedUsd(
      normalizedRaisedUsd != 0
        ? Math.floor(normalizedRaisedUsd) || undefined
        : 0
    )
  }, [normalizedRaisedUsd])

  useEffect(() => {
    setTargetEth(normalizedTargetEth)
  }, [normalizedTargetEth])

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
                  ? "text-yellow-600"
                  : "text-green-600"
              }
            >
              {formatNumber(
                (cap && isHardcapUsd) || isTargetUsd ? raisedUsd : raised,
                1
              )}
            </span>{" "}
            {cap != 0 && `/ ${formatNumber(cap, 1)}`}{" "}
            {isCurrencyUsd((cap && isHardcapUsd) || isTargetUsd)}
          </b>
        </p>
        <p>
          Deadline:{" "}
          <b
            className={
              timeLeft > 0 && timeLeft < 259200 ? "text-yellow-600" : ""
            }
          >
            {deadline && Number(deadline) != 0
              ? timeLeft > 0
                ? `${formattedTimeLeft} ${formattedTimeLeftUnits}`
                : "passed"
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
                {isCurrencyUsd(isTargetUsd)}
              </b>
            </>
          )}
        </p>
        {issuance && tokenIssuance >= 1 && (
          <p>
            <b>
              {formatNumber(tokenIssuance, 1)} {tokenSymbol || ""}
            </b>{" "}
            / ETH
          </p>
        )}
      </div>
    </div>
  )
}

export default RoundDetails
