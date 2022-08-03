import {
  Input,
  Button,
  PieChart,
  ReservedTable,
  Textarea
} from "@components/ui"
import { useEffect, useState } from "react"

const CreateRoundForm = () => {
  const [name, setName] = useState("")
  const [isEth, setIsEth] = useState(true)
  const [target, setTarget] = useState(0)
  const [tokens, setTokens] = useState(0)
  const [reservedPool, setReservedPool] = useState(50)
  const [reservedStake, setReservedStake] = useState(10)
  const [description, setDescription] = useState("")

  const currency = isEth ? "Ξ" : "$"

  useEffect(() => {
    if (Number(reservedStake) > Number(reservedPool)) {
      setReservedStake(reservedPool)
    }
  }, [reservedPool])

  return (
    <div className="space-y-6 text-left">
      <div>
        <Input label="Project name" value={name} onChange={setName} />
      </div>
      <div>
        <Textarea
          label="Project description"
          value={description}
          onChange={setDescription}
        />
      </div>
      <div>
        <Input
          type="number"
          label="Fundraise target"
          prefix={currency}
          prefixAction={() => setIsEth((isEth) => !isEth)}
          min={0}
          value={target}
          onChange={setTarget}
        />
      </div>
      <div>
        <Input
          type="number"
          label="Tokens per ETH"
          min={0}
          value={tokens}
          onChange={setTokens}
          question={
            <>
              Number of tokens to issue per ETH contributed. How many reserved
              out of the gates.
            </>
          }
        />
      </div>
      <div>
        <Input
          type="range"
          label={
            <>
              Reserved rate pool: <b>{Number(reservedPool).toFixed(1)}%</b>
            </>
          }
          min={0}
          step={0.5}
          value={reservedPool}
          onChange={setReservedPool}
          question={
            <>
              Percentage of tokens minted to the reserved pool for every
              treasury contribution.
            </>
          }
        />
      </div>
      <div>
        <Input
          type="range"
          label={
            <>
              Round stake: <b>{Number(reservedStake).toFixed(1)}%</b> (
              {Number((reservedStake * 100) / reservedPool).toFixed(1)}% of
              pool)
            </>
          }
          min={0}
          max={reservedPool}
          step={0.5}
          value={reservedStake}
          onChange={setReservedStake}
          question={
            <>
              Percentage of reserved tokens being committed to share between the
              participants in future cycles.
            </>
          }
        />
      </div>
      <div className="pt-12 pb-8">
        <p className="pb-8 text-base text-center">Token emission preview</p>
        <div className="text-black">
          <PieChart
            addresses={["Contributor", "Other reserved", "Blunt round"]}
            shares={[
              100 - reservedPool,
              reservedPool - reservedStake,
              reservedStake
            ]}
            total={100}
          />
        </div>
      </div>
      <div className="pb-6">
        <ReservedTable
          reservedPool={reservedPool}
          reservedStake={reservedStake}
        />
      </div>
      <div className="pt-6 text-center">
        <Button label="Create" />
      </div>
    </div>
  )
}

export default CreateRoundForm
