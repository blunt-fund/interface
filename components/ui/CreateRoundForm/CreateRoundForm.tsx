import {
  Input,
  Button,
  CollapsibleItem,
  PieChart,
  ReservedBlockSplitter,
  ReservedTable,
  Textarea
} from "@components/ui"
import React, { useEffect, useState } from "react"

const CreateRoundForm = () => {
  const [name, setName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenIssuance, setTokenIssuance] = useState(0)
  const [reservedPool, setReservedPool] = useState(50)
  const [reservedStake, setReservedStake] = useState(10)
  const [description, setDescription] = useState("")

  const [duration, setDuration] = useState(0)
  const [isTargetEth, setIsTargetEth] = useState(true)
  const [target, setTarget] = useState(0)
  const [isCapEth, setIsCapEth] = useState(true)
  const [cap, setCap] = useState(0)

  const [settingsError, setSettingsError] = useState(false)
  const [reservedError, setReservedError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [addresses, setAddresses] = useState([""])
  const [shares, setShares] = useState([100])
  const [totalShares, setTotalShares] = useState(10)

  const handleSetTokenSymbol = (a: string) => {
    setTokenSymbol(a.toUpperCase())
  }

  useEffect(() => {
    if (Number(reservedStake) > Number(reservedPool)) {
      setReservedStake(reservedPool)
    }
  }, [reservedPool])

  useEffect(() => {
    let items = shares
    items[0] = reservedStake
    setShares(items)

    setTotalShares(
      shares.length > 1
        ? Number(shares.slice(1).reduce((a, b) => Number(a) + Number(b))) +
            Number(reservedStake)
        : Number(reservedStake)
    )
  }, [reservedStake])

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
      <div className="xs:flex xs:gap-8">
        <div className="xs:w-48">
          <Input
            type="string"
            label="Token symbol"
            value={tokenSymbol}
            onChange={handleSetTokenSymbol}
            question={
              <>
                Symbol of the ERC20 token to be issued for the project.
                Tipically between 3 and 7 letters.
              </>
            }
          />
        </div>
        <div className="pt-8 xs:pt-0 xs:flex-grow">
          <Input
            type="number"
            label="Tokens issued per ETH"
            min={0}
            value={tokenIssuance != 0 ? tokenIssuance : ""}
            onChange={setTokenIssuance}
            placeholder="Optional"
            question={
              <>
                Number of tokens to issue per ETH contributed during the blunt
                round.
              </>
            }
            questionPosition="bottom-[-4px] left-0 xs:left-[-96px]"
          />
        </div>
      </div>
      {/* <div>
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
      </div> */}
      {/* <div className="pb-6">
        <Input
          type="range"
          label={
            <>
              Round stake: <b>{Number(reservedStake).toFixed(1)}%</b>
              ( {Number((reservedStake * 100) / reservedPool).toFixed(1)}% of pool) 
            </>
          }
          min={0}
          max={reservedPool}
          step={0.5}
          value={reservedStake}
          onChange={setReservedStake}
          question={
            <>
              Percentage of future issued tokens shared between the round
              participants.
            </>
          }
        />
      </div> */}
      <div className="pb-6">
        <Input
          type="range"
          label={
            <>
              Round stake: <b>{Number(reservedStake).toFixed(1)}%</b>
            </>
          }
          min={0}
          max={100 - Number(totalShares) + Number(reservedStake)}
          step={0.5}
          value={reservedStake}
          onChange={setReservedStake}
          question={
            <>
              Percentage of future issued tokens shared between the round
              participants.
            </>
          }
        />
      </div>
      {/* <div className="pb-6">
        <ReservedTable
          reservedPool={reservedPool}
          reservedStake={reservedStake}
        />
      </div> */}
      <p className="font-bold">Advanced settings</p>
      <ul className="space-y-6">
        <CollapsibleItem
          label="Fundraise duration, target and cap"
          error={settingsError}
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
          error={reservedError}
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
                  reservedStake={reservedStake}
                  setAddresses={setAddresses}
                  setShares={setShares}
                  setTotalShares={setTotalShares}
                  setReservedError={setReservedError}
                />
              </div>
            </>
          }
        />
      </ul>

      <div className="py-8">
        <p className="pb-8 text-base text-center">Token emission preview</p>
        <div className="text-black">
          <PieChart
            addresses={["Contributor", ...addresses.slice(1), "Blunt round"]}
            shares={[
              100 - totalShares,
              ...shares.slice(1),
              Number(reservedStake)
            ]}
            total={100}
          />
        </div>
      </div>
      <div className="pb-6">
        <ReservedTable
          reservedPool={totalShares}
          reservedStake={Number(reservedStake)}
        />
      </div>
      <div className="pt-6 text-center">
        <Button label="Create" />
      </div>
    </div>
  )
}

export default CreateRoundForm
