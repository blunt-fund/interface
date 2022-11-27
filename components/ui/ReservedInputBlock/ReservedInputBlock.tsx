import { useEffect, Dispatch, SetStateAction, useState } from "react"
import { Input, InputAddress } from "@components/ui"
import Delete from "@components/icons/Delete"
import Crown from "@components/icons/Crown"
import { RoundData } from "utils/getRounds"
import { ethers } from "ethers"

type Props = {
  index: number
  roundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
  totalShares: number
  projectOwner: string
}

const ReservedInputBlock = ({
  index,
  roundData,
  setRoundData,
  totalShares,
  projectOwner
}: Props) => {
  const { addresses, shares } = roundData

  const sharesAmount = shares[index] || 0
  const address = addresses[index] || ""

  const [resolvedAddress, setResolvedAddress] = useState("")

  const handleSetAddress = (value: string) => {
    const data = { ...roundData }
    data["addresses"][index] = value
    setRoundData(data)
  }

  const handleSetShareAmount = (value: number) => {
    const data = { ...roundData }
    data["shares"][index] = value
    setRoundData(data)
  }

  const handleRemove = () => {
    const data = { ...roundData }
    data["addresses"].splice(index, 1)
    data["shares"].splice(index, 1)
    setRoundData(data)
  }

  useEffect(() => {
    if (address == "" && projectOwner) {
      if (index == 1) {
        handleSetAddress(projectOwner)
      }
    }
  }, [projectOwner])

  return (
    <>
      <div className="col-span-1 col-start-1 mx-auto">
        <div className="relative">
          {index != 0 && <Delete onClick={handleRemove} />}
          {address &&
            (projectOwner.toLowerCase() === address.toLowerCase() ||
              projectOwner?.toLowerCase() ===
                resolvedAddress?.toLowerCase()) && (
              <div
                className="hidden sm:block absolute top-[6px] right-[-20px] w-3 h-3"
                title="Project owner"
              >
                <Crown />
              </div>
            )}
        </div>
      </div>
      <div className="col-span-7 xs:col-span-6 md:col-span-8">
        <InputAddress
          address={address != ethers.constants.AddressZero ? address : ""}
          onChange={handleSetAddress}
          required={sharesAmount != 0}
          resolvedAddress={resolvedAddress}
          setResolvedAddress={setResolvedAddress}
          disabled={index === 0}
          placeholder={index === 0 ? "Blunt round" : undefined}
        />
      </div>
      <p className="col-span-5 pr-2 text-sm text-right xs:hidden">Reserved %</p>
      <div className="col-span-3">
        <Input
          type="number"
          placeholder={
            totalShares <= 100 ? `up to ${100 - totalShares}` : undefined
          }
          min="0"
          max={100}
          step={0.1}
          value={sharesAmount != 0 ? sharesAmount : ""}
          error={sharesAmount > 100}
          required={address && true}
          onChange={handleSetShareAmount}
        />
      </div>

      <hr className="w-20 col-span-8 mx-auto my-6 border-gray-300 xs:hidden" />
    </>
  )
}

export default ReservedInputBlock
