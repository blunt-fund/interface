import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { ReservedInputBlock } from "@components/ui"
import Add from "@components/icons/Add"
import { useAppContext } from "@components/ui/context"

type Props = {
  success: boolean
  addresses: string[]
  shares: number[]
  totalShares: number
  setAddresses: Dispatch<SetStateAction<string[]>>
  setShares: Dispatch<SetStateAction<number[]>>
}

const ReservedBlockSplitter = ({
  success,
  addresses,
  shares,
  totalShares,
  setAddresses,
  setShares
}: Props) => {
  const { account } = useAppContext()
  const [initAddress, setInitAddress] = useState("")
  const [inputCount, setInputCount] = useState(1)
  const [removedCount, setRemovedCount] = useState(0)

  useEffect(() => {
    setInitAddress(account)
  }, [account])

  useEffect(() => {
    if (success) {
      resetInputs()
    }
  }, [success])

  const resetInputs = () => {
    setInputCount(2)
    setRemovedCount(0)
    setAddresses([initAddress])
    setShares([totalShares])
  }

  return (
    <div className="grid items-center grid-cols-8 text-left xs:grid-cols-10 md:grid-cols-12 gap-x-4 gap-y-6 xs:gap-y-12">
      <p className="mb-[-25px] text-sm text-gray-700 font-semibold hidden xs:block xs:col-span-6 xs:col-start-2 md:col-span-7 md:col-start-2">
        Beneficiary
      </p>
      <p className="mb-[-25px] col-span-3 text-gray-700 relative hidden pr-1 text-sm font-semibold xs:block">
        Reserved %
      </p>
      {[...Array(inputCount)].map((el, key) => {
        const i = key
        return (
          <ReservedInputBlock
            key={key}
            index={i}
            signerAddress={initAddress}
            addresses={addresses}
            shares={shares}
            removedCount={removedCount}
            setAddresses={setAddresses}
            setShares={setShares}
            setRemovedCount={setRemovedCount}
            placeholder="up to 100"
          />
        )
      })}

      <div className="flex col-span-5 pl-1 text-blue-600 opacity-75 cursor-pointer hover:opacity-100 xs:pl-2">
        <Add onClick={() => setInputCount(inputCount + 1)} />
        <p
          className="inline-block pl-4 font-semibold"
          onClick={() => setInputCount(inputCount + 1)}
        >
          Add beneficiary
        </p>
      </div>

      {/* <div className="flex items-center col-span-2 col-start-7 xs:col-start-8">
        <p
          className={`text-sm font-bold ${
            totalShares > 100 ? "text-red-500" : ""
          }`}
        >
          {totalShares}% Total
        </p>
      </div> */}
    </div>
  )
}

export default ReservedBlockSplitter
