import Add from "@components/icons/Add"
import { ReservedInputBlock } from "@components/ui"
import { Dispatch, SetStateAction } from "react"
import { RoundData } from "utils/getRounds"

type Props = {
  roundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
  totalShares: number
  projectOwner: string
}

const CreateFormAdvancedReservedRate = ({
  roundData,
  setRoundData,
  totalShares,
  projectOwner
}: Props) => {
  const { addresses } = roundData

  const addAccount = () => {
    const data = { ...roundData }
    data["addresses"].push("")
    data["shares"].push(0)
    setRoundData(data)
  }

  return (
    <div className="space-y-8 py-3">
      <p>
        Add reserved rate beneficiaries in addition to blunt round participants.
      </p>
      <div className="grid grid-cols-8 items-center gap-x-4 gap-y-6 text-left xs:grid-cols-10 xs:gap-y-10 md:grid-cols-12">
        <p className="mb-[-25px] hidden text-sm font-semibold text-gray-700 xs:col-span-6 xs:col-start-2 xs:block md:col-span-7 md:col-start-2">
          Beneficiary
        </p>
        <p className="relative col-span-3 mb-[-25px] hidden pr-1 text-sm font-semibold text-gray-700 xs:block">
          Reserved %
        </p>
        {addresses.map((el, key) => {
          const i = key
          return (
            <ReservedInputBlock
              key={key}
              index={i}
              roundData={roundData}
              setRoundData={setRoundData}
              totalShares={totalShares}
              projectOwner={projectOwner}
            />
          )
        })}

        <div className="col-span-5 flex cursor-pointer pl-1 opacity-75 text-yellow-600 hover:opacity-100 xs:pl-2.5">
          <Add onClick={() => addAccount()} />
          <p
            className="inline-block pl-4 font-semibold"
            onClick={() => addAccount()}
          >
            Add beneficiary
          </p>
        </div>

        <div className="col-span-3 col-start-6 flex items-center xs:col-start-8">
          <p
            className={`text-sm font-bold ${
              totalShares > 100 ? "text-red-500" : ""
            }`}
          >
            Total: {totalShares}%
          </p>
        </div>
      </div>
      {/* <div className="text-black">
        <PieChart
          addresses={["Contributor", ...addresses.slice(1), "Blunt round"]}
          shares={[
            100 - totalShares,
            ...shares.slice(1),
            Number(reservedStake)
          ]}
          total={100}
        />
      </div> */}
    </div>
  )
}

export default CreateFormAdvancedReservedRate
