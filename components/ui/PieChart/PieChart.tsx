import chartGenerator from "./chartGenerator"
import { useState } from "react"

type Props = {
  addresses: string[]
  shares: number[]
  minimumShares?: number
  total: number
}

const PieChart = ({ addresses, shares, minimumShares, total }: Props) => {
  const radius = 7
  const chartPerimeter = Math.PI * 2 * radius
  const newConfiguration = chartGenerator({
    addresses,
    shares,
    totalShares: total,
    minimumShares
  })
  const [sliceData, setSliceData] = useState({
    address: null,
    percentageToRender: null,
    isSuperOwner: false
  })

  return (
    <div className="relative flex justify-center pt-2">
      <svg
        height={20}
        width={20}
        viewBox={"0 0 20 20"}
        className="w-4/5 max-w-[18rem] h-4/5"
      >
        {newConfiguration.map((slice, index) => {
          if (!slice || !slice.percentageToRender) return null
          return (
            <circle
              onMouseEnter={() => {
                setSliceData({
                  percentageToRender: slice.percentageToRender,
                  address: slice.address,
                  isSuperOwner: slice.isSuperOwner
                })
              }}
              onMouseLeave={() => {
                setSliceData({
                  percentageToRender: null,
                  address: null,
                  isSuperOwner: false
                })
              }}
              key={index}
              r={radius}
              cx={10}
              cy={10}
              fill="transparent"
              stroke={"currentColor"}
              className={`nightwind-prevent ${slice.color}`}
              strokeWidth={slice.isSuperOwner ? 6 : 4}
              strokeDasharray={`${
                (slice.percentageToRender * chartPerimeter) / 100
              } ${chartPerimeter}`}
              strokeDashoffset={slice.percentageToRender === 100 ? 0 : 0.2}
              transform={`rotate(${-90 + slice.startAngle} 10 10)`}
            />
          )
        })}
        <circle
          r={7.2}
          cx={10}
          cy={10}
          fill="currentColor"
          className="text-white"
        />
      </svg>
      <div className="absolute mt-0 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        {sliceData.percentageToRender ? (
          <>
            <p className={`sm:text-3xl text-xl font-black text-center`}>
              {sliceData.percentageToRender * 10}
            </p>
            <p className="text-xs text-center">
              {sliceData.address.length === 42
                ? sliceData.address.slice(0, 5) +
                  "___" +
                  sliceData.address.slice(39, 42)
                : sliceData.address}
              {minimumShares && (sliceData.isSuperOwner ? " 👑" : "")}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs text-center">Issuance for</p>
            <p
              className={`sm:text-3xl text-xl font-black text-center ${
                total > 4000000000 ? "text-red-500 font-bold" : ""
              }`}
            >
              {total * 10}
            </p>
            <p
              className={`text-xs text-center ${
                total > 4000000000 ? "text-red-500" : ""
              }`}
            >
              tokens minted
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default PieChart
