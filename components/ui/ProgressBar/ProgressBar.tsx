import React from "react"

type Props = {
  min?: number
  max?: number
  target?: number
  raised?: number
}

const ProgressBar = ({ min, max, target, raised }: Props) => {
  return (
    <div className="relative flex items-center w-full h-1 text-black bg-white border border-gray-400 rounded-sm ">
      <div className="absolute w-full p-3 overflow-hidden">
        <div className="relative flex items-center h-6 ">
          {target != 0 && (
            <div
              className="absolute w-1.5 py-3 rounded-sm bg-blue-600 nightwind-prevent"
              style={{ right: `${100 - (target * 100) / max}%` }}
            />
          )}
          <div className="absolute w-1.5 py-3 right-0 rounded-sm bg-black"></div>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
