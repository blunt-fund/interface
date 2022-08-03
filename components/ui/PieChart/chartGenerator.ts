type Props = {
  addresses: string[]
  shares: number[]
  totalShares: number
  minimumShares?: number
}
type ChartSlice = {
  startAngle: number
  color: string
  percentageToRender: number
  address: string
  isSuperOwner: boolean
}

export default function chartGenerator({
  addresses,
  shares,
  totalShares,
  minimumShares
}: Props): ChartSlice[] {
  let currentPercentage = 0 // percentage of the chart that has been filled
  let numberOfElementsWithResidualPercentage = 0 // number of elements with less then 1% of the total shares

  const colorList = ["text-gray-700", "text-blue-200", "text-blue-600"]

  const chartSlices = shares.map((share, index) => {
    // ignore empty values around the form
    if (share === 0) {
      return null
    }

    const percentageToRender =
      Math.floor((Number(share) / totalShares) * 10000) / 100
    const color = colorList[index % colorList.length]

    // define start angle
    const startAngle = (currentPercentage / 100) * 360

    // if percentageToRender is less than 1, we need to render the rest of the pie
    if (percentageToRender < 1) {
      numberOfElementsWithResidualPercentage++
      return {
        startAngle,
        color,
        percentageToRender: 0,
        address: addresses[index] || "...",
        isSuperOwner: minimumShares ? share >= minimumShares : true
      }
    }
    currentPercentage += percentageToRender

    return {
      startAngle,
      color,
      percentageToRender,
      address: addresses[index] || "...",
      isSuperOwner: minimumShares ? share >= minimumShares : true
    }
  })

  // render the residual's slice or fill the rest of the pie
  if (numberOfElementsWithResidualPercentage === 1) {
    const residualPercentage = 100 - currentPercentage
    chartSlices.find(
      (slice) => slice?.percentageToRender === 0
    ).percentageToRender = residualPercentage > 0.5 ? residualPercentage : 0.5
  } else if (numberOfElementsWithResidualPercentage > 1) {
    chartSlices.push({
      startAngle: (currentPercentage / 100) * 360,
      color: colorList[1],
      percentageToRender: 100 - currentPercentage,
      address: `${numberOfElementsWithResidualPercentage} addresses with less then 1%`,
      isSuperOwner: false
    })
  } else if (
    !numberOfElementsWithResidualPercentage &&
    currentPercentage < 100 &&
    chartSlices[chartSlices.length - 1]
  ) {
    chartSlices[chartSlices.length - 1].percentageToRender +=
      100 - currentPercentage
  }

  return chartSlices
}
