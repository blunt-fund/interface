import { Dispatch, SetStateAction } from "react"
import { ReservedInputBlock } from "@components/ui"
import Add from "@components/icons/Add"
import { RoundData } from "../CreateRoundForm/CreateRoundForm"

type Props = {
  createRoundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
  totalShares: number
  projectOwner: string
}

const CreateFormAdvancedReservedRate = ({
  createRoundData,
  setRoundData,
  totalShares,
  projectOwner
}: Props) => {
  const { addresses } = createRoundData

  const addAccount = () => {
    const data = { ...createRoundData }
    data["addresses"].push("")
    data["shares"].push(0)
    setRoundData(data)
  }

  return (
    <div className="py-3 space-y-6">
      <p>
        Add beneficiaries to the reserved rate in addition to blunt round
        participants.
      </p>
      <div className="grid items-center grid-cols-8 text-left xs:grid-cols-10 md:grid-cols-12 gap-x-4 gap-y-6 xs:gap-y-10">
        <p className="mb-[-25px] text-sm text-gray-700 font-semibold hidden xs:block xs:col-span-6 xs:col-start-2 md:col-span-7 md:col-start-2">
          Beneficiary
        </p>
        <p className="mb-[-25px] col-span-3 text-gray-700 relative hidden pr-1 text-sm font-semibold xs:block">
          Reserved %
        </p>
        {addresses.map((el, key) => {
          const i = key
          return (
            <ReservedInputBlock
              key={key}
              index={i}
              createRoundData={createRoundData}
              setRoundData={setRoundData}
              totalShares={totalShares}
              projectOwner={projectOwner}
            />
          )
        })}

        <div className="flex col-span-5 pl-1 text-blue-600 opacity-75 cursor-pointer hover:opacity-100 xs:pl-2.5">
          <Add onClick={() => addAccount()} />
          <p
            className="inline-block pl-4 font-semibold"
            onClick={() => addAccount()}
          >
            Add beneficiary
          </p>
        </div>

        <div className="flex items-center col-span-3 col-start-6 xs:col-start-8">
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
