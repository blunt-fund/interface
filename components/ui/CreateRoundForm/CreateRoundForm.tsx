import {
  Input,
  Button,
  CollapsibleItem,
  PieChart,
  ReservedBlockSplitter,
  ReservedTable,
  Textarea
} from "@components/ui"
import { useEffect, useState } from "react"

const CreateRoundForm = () => {
  const [name, setName] = useState("")
  const [tokens, setTokens] = useState(0)
  const [reservedPool, setReservedPool] = useState(50)
  const [reservedStake, setReservedStake] = useState(10)
  const [description, setDescription] = useState("")

  const [duration, setDuration] = useState(0)
  const [isTargetEth, setIsTargetEth] = useState(true)
  const [target, setTarget] = useState(0)
  const [isCapEth, setIsCapEth] = useState(true)
  const [cap, setCap] = useState(0)

  const [success, setSuccess] = useState(false)
  const [addresses, setAddresses] = useState([""])
  const [shares, setShares] = useState([100])
  const [totalShares, setTotalShares] = useState(100)

  useEffect(() => {
    console.log(123)

    setTotalShares(shares.reduce((a, b) => a + b))
  }, [shares])

  useEffect(() => {
    if (Number(reservedStake) > Number(reservedPool)) {
      setReservedStake(reservedPool)
    }
  }, [reservedPool])

  return (
    <div className="space-y-8 text-left">
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
          label="Tokens issued per ETH"
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
      <p className="font-bold">Advanced settings</p>
      <ul className="space-y-6">
        <CollapsibleItem
          label="Fundraise duration, target and cap"
          detail={
            <>
              <div className="py-3 space-y-6">
                <p>
                  Blunt rounds are unlimited, uncapped and without target by
                  default. Customize your round by specifying them below
                </p>
                <div>
                  <Input
                    type="number"
                    label="Fundraise duration (days)"
                    min={0}
                    value={duration}
                    onChange={setDuration}
                    question={
                      <>
                        <p>Choose how long will the round last.</p>
                        <p>Set to 0 to make duration unlimited.</p>
                      </>
                    }
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    label="Target"
                    prefix={isTargetEth ? "Ξ" : "$"}
                    prefixAction={() =>
                      setIsTargetEth((isTargetEth) => !isTargetEth)
                    }
                    min={0}
                    value={target}
                    onChange={setTarget}
                    question={
                      <>
                        <p>
                          If the target is not reached before the duration, the
                          round will close and contributions can be fully
                          refunded.
                        </p>
                        <p>Set to 0 to disable.</p>
                      </>
                    }
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    label="Hard cap"
                    prefix={isCapEth ? "Ξ" : "$"}
                    prefixAction={() => setIsCapEth((isCapEth) => !isCapEth)}
                    min={0}
                    value={cap}
                    onChange={setCap}
                    question={
                      <>
                        <p>
                          Contributions will be rejected once the hard cap is
                          reached. This guarantees contributors{" "}
                          <b>a minimum guaranteed amount of reserved rate</b>.
                        </p>
                        <p>Set to 0 to disable.</p>
                      </>
                    }
                  />
                </div>
              </div>
            </>
          }
        />
        <CollapsibleItem
          label="Reserved rate configuration"
          detail={
            <>
              <div className="py-3 space-y-6">
                <p className="pt-8">
                  Customize the beneficiaries for <i>other reserved</i>
                </p>
                <ReservedBlockSplitter
                  success={success}
                  addresses={addresses}
                  shares={shares}
                  totalShares={totalShares}
                  setAddresses={setAddresses}
                  setShares={setShares}
                />
              </div>
            </>
          }
        />
      </ul>
      <div className="pt-6 text-center">
        <Button label="Create" />
      </div>
    </div>
  )
}

export default CreateRoundForm
