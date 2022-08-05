import { useEffect, Dispatch, SetStateAction, useState } from "react"
import { Input, InputAddress } from "@components/ui"
import Delete from "@components/icons/Delete"
import { useAppContext } from "@components/ui/context"
import resolveEns from "@utils/resolveEns"
import Crown from "@components/icons/Crown"

type Props = {
  index: number
  addresses: string[]
  shares: number[]
  totalShares: number
  reservedStake: number
  removedCount: number
  setAddresses: Dispatch<SetStateAction<string[]>>
  setShares: Dispatch<SetStateAction<number[]>>
  setTotalShares: Dispatch<SetStateAction<number>>
  setRemovedCount: Dispatch<SetStateAction<number>>
  signerAddress?: string
}

const ReservedInputBlock = ({
  index,
  signerAddress,
  addresses,
  shares,
  totalShares,
  reservedStake,
  setAddresses,
  setShares,
  setTotalShares,
  removedCount,
  setRemovedCount
}: Props) => {
  const { account, provider } = useAppContext()

  const [visible, setVisible] = useState(true)
  const [address, setAddress] = useState(addresses[index] || "")
  const [resolvedAddress, setResolvedAddress] = useState("")
  const [sharesAmount, setSharesAmount] = useState(shares[index] || 0)
  const [resolvedSignerAddress, setResolvedSignerAddress] = useState("")

  const handleChange = (
    value: string | number,
    currentState: string[] | number[],
    setState: Dispatch<SetStateAction<string[] | number[]>>
  ) => {
    let items = currentState
    items[index] = value
    setState(items)
  }

  const handleRemove = () => {
    setSharesAmount(0)
    setAddress("")
    let tempShares = shares
    let tempAddresses = addresses
    setShares(tempShares)
    setAddresses(tempAddresses)
    setVisible(false)
    setRemovedCount(removedCount + 1)
  }

  useEffect(() => {
    if (address == "" && signerAddress) {
      if (index == 1) {
        setAddress(signerAddress)
      }
      resolveEns(provider, signerAddress, setResolvedSignerAddress)
    }
  }, [signerAddress])

  useEffect(() => {
    handleChange(address, addresses, setAddresses)
  }, [address])

  useEffect(() => {
    handleChange(sharesAmount, shares, setShares)
    setTotalShares(
      shares.reduce((a, b) => Number(a) + Number(b)) -
        Number(shares[0]) +
        Number(reservedStake)
    )
  }, [sharesAmount, reservedStake])

  return (
    visible && (
      <>
        <div className="col-span-1 col-start-1 mx-auto">
          <div className="">
            {index != 0 ? (
              address &&
              (account === address || resolvedSignerAddress === address) ? (
                <div className="w-5 h-5">
                  <Crown />
                </div>
              ) : (
                <Delete onClick={handleRemove} />
              )
            ) : null}
          </div>
        </div>
        <div className="col-span-7 xs:col-span-6 md:col-span-8">
          <InputAddress
            address={address}
            onChange={setAddress}
            required={sharesAmount != 0}
            resolvedAddress={resolvedAddress}
            setResolvedAddress={setResolvedAddress}
            disabled={index === 0}
            placeholder={index === 0 ? "Blunt round" : undefined}
          />
        </div>
        <p className="col-span-5 pr-2 text-sm text-right xs:hidden">
          Reserved %
        </p>
        <div className="col-span-3">
          <Input
            type="number"
            placeholder={
              totalShares <= 100 ? `up to ${100 - totalShares}` : undefined
            }
            min="0"
            max={100}
            value={
              index == 0 ? reservedStake : sharesAmount != 0 ? sharesAmount : ""
            }
            error={sharesAmount > 100}
            required={address && true}
            onChange={setSharesAmount}
            disabled={index === 0}
          />
        </div>

        <hr className="w-20 col-span-8 mx-auto my-6 border-gray-300 xs:hidden" />
      </>
    )
  )
}

export default ReservedInputBlock
