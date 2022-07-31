import { Input, Button, Textarea } from "@components/ui"
import { useState } from "react"

const CreateRoundForm = () => {
  const [name, setName] = useState("")
  const [isEth, setIsEth] = useState(true)
  const [target, setTarget] = useState(0)
  const [tokens, setTokens] = useState(0)
  const [reservedStake, setReservedStake] = useState(0)
  const [description, setDescription] = useState("")

  const currency = isEth ? "Ξ" : "$"

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
          className="!h-1 !py-0 !pl-3 !pr-3 !mt-3 !bg-black !cursor-default focus:!border-gray-400 dark:!focus:border-gray-500"
          type="range"
          label={`Reserved stake for participants: ${reservedStake}%`}
          min={0}
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
      <div className="pt-6 text-center">
        <Button label="Create" />
      </div>
    </div>
  )
}

export default CreateRoundForm
