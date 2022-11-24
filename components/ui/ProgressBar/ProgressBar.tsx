import React from "react"

type Props = {
  min?: number
  max?: number
  target?: number
  raised?: number
  isCapped?: boolean
}

const ProgressBar = ({ max, target, raised, isCapped }: Props) => {
  const targetPercentage = 100 - (target * 100) / max
  const raisedPercentage = (raised * 100) / max

  const raisedColor = raised < target ? "currentColor" : "#2563EB"

  return (
    <div
      className="relative flex items-center w-full h-2 text-yellow-500 border border-gray-400 rounded-sm dark:text-yellow-300 "
      style={{
        background: `linear-gradient(to right, ${raisedColor}, ${raisedColor} ${raisedPercentage}%, transparent ${raisedPercentage}%)`
      }}
    >
      <div className="absolute w-full p-3 overflow-hidden">
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
