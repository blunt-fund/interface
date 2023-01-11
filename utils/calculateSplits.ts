import { BigNumber, ethers } from "ethers"

const calculateSplits = (
  shares: number[],
  addresses: string[],
  totalShares: number
) => {
  if (totalShares != 0) {
    const filteredData = shares.flatMap((el, i) =>
      addresses[i] && Number(el) != 0
        ? { shares: el, address: addresses[i] }
        : []
    )

    const splits = filteredData.map(({ shares, address }, i) => ({
      preferClaimed:
        i == 0 && address == ethers.constants.AddressZero ? true : false,
      preferAddToBalance: false,
      percent: BigNumber.from(shares * 1e10).div(totalShares * 10),
      projectId: 0,
      beneficiary: address,
      lockedUntil: 0,
      allocator: ethers.constants.AddressZero
    }))

    let remainder = 1e9
    splits.forEach((el) => (remainder -= Number(el.percent)))
    if (remainder != 0) {
      splits[0].percent = splits[0].percent.add(remainder)
    }

    return splits
  } else {
    return []
  }
}

export default calculateSplits
