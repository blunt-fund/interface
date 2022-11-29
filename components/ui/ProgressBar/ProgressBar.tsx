import React from "react"

type Props = {
  min?: number
  max?: number
  target?: number
  raised?: number
  isCapped?: boolean
  active?: boolean
}

const ProgressBar = ({ max, target, raised, isCapped, active }: Props) => {
  const targetPercentage = 100 - (target * 100) / max
  const raisedPercentage = (raised * 100) / max

  const raisedColor =
    raised < target ? (active ? "currentColor" : "#6C6C76") : "#2563EB"

  return (
    <div className="relative">
      <div
        className="flex items-center w-full h-2 text-yellow-500 rounded-sm dark:text-yellow-300 "
        style={{
          background: `linear-gradient(to right, ${raisedColor}, ${raisedColor} ${raisedPercentage}%, transparent ${raisedPercentage}%)`,
          animation: active
            ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            : ""
        }}
      />
      <div className="absolute top-0 w-full h-2 border border-gray-400" />
      <div className="absolute top-[-8px] w-full px-3 overflow-hidden">
        <div className="relative flex items-center h-6 ">
          {target != 0 && (
            <div
              className="absolute w-1.5 py-3 rounded-sm bg-blue-600 nightwind-prevent"
              style={{ right: `${targetPercentage}%` }}
            />
          )}
          {isCapped && (
            <div className="absolute w-1.5 py-3 right-0 rounded-sm bg-black" />
          )}
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
