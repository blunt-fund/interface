import { BigNumber, ethers } from "ethers"

const calculateSplits = (
  shares: number[],
  addresses: string[],
  totalShares: number,
  roundTimeLock: number
) => {
  const splits = shares
    .map((share, i) => ({
      preferClaimed: i == 0 ? true : false,
      preferAddToBalance: false,
      percent: BigNumber.from(share * 1e10).div(totalShares * 10),
      projectId: 0,
      beneficiary: addresses[i],
      lockedUntil: i == 0 ? roundTimeLock : 0,
      allocator: ethers.constants.AddressZero
    }))
    .filter((el) => Number(el.percent) != 0)

  let remainder = 1e9
  splits.forEach((el) => (remainder -= Number(el.percent)))
  if (remainder != 0) {
    splits[0].percent = splits[0].percent.add(remainder)
  }

  return splits
}

export default calculateSplits
