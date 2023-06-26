import React from "react"

type Props = {
  min?: number
  max?: number
  target?: number
  raised?: number
  isCapped?: boolean
  active?: boolean
  hasEndedUnsuccessfully?: boolean
}

const ProgressBar = ({
  max,
  target,
  raised,
  isCapped,
  active,
  hasEndedUnsuccessfully
}: Props) => {
  const targetPercentage = 100 - (target * 100) / max
  const raisedPercentage = raised
    ? Math.round((raised * 1e8) / max) / 1e6 + 1.5
    : 0
  const raisedPercentageFormatted =
    raisedPercentage > 100 ? 100 : raisedPercentage

  const raisedColor =
    raised < target || hasEndedUnsuccessfully
      ? active
        ? "currentColor"
        : "#6C6C76"
      : "#22C55E"

  return (
    <div className="relative">
      <div
        className="flex h-2 w-full items-center rounded-sm text-yellow-500 dark:text-yellow-300 "
        style={{
          background: `linear-gradient(to right, ${raisedColor}, ${raisedColor} ${raisedPercentageFormatted}%, transparent ${raisedPercentage}%)`,
          animation: active
            ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            : ""
        }}
      />
      <div className="absolute top-0 h-2 w-full border border-gray-400" />
      <div className="absolute top-[-8px] w-full overflow-hidden px-3">
        <div className="relative flex h-6 items-center ">
          {target != 0 && (
            <div
              className={`absolute w-1.5 rounded-sm py-3 ${
                raised < target || hasEndedUnsuccessfully
                  ? "bg-blue-600"
                  : "bg-green-500"
              } nightwind-prevent`}
              style={{ right: `${targetPercentage}%` }}
            />
          )}
          {isCapped && (
            <div className="absolute right-0 w-1.5 rounded-sm py-3 bg-black" />
          )}
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
