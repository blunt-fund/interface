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
import { useAppContext } from "../context"

const CreateRoundForm = () => {
  const { setModalView } = useAppContext()

  const [name, setName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenIssuance, setTokenIssuance] = useState(0)
  const [reservedStake, setReservedStake] = useState(10)
  const [description, setDescription] = useState("")
  const [website, setWebsite] = useState("")
  const [twitter, setTwitter] = useState("")
  const [discord, setDiscord] = useState("")
  const [docs, setDocs] = useState("")

  const [duration, setDuration] = useState(0)
  const [isTargetEth, setIsTargetEth] = useState(true)
  const [target, setTarget] = useState(0)
  const [isCapEth, setIsCapEth] = useState(true)
  const [cap, setCap] = useState(0)

  const [reservedError, setReservedError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [addresses, setAddresses] = useState([""])
  const [shares, setShares] = useState([100])
  const [totalShares, setTotalShares] = useState(10)

  const handleSetTokenSymbol = (a: string) => {
    setTokenSymbol(a.toUpperCase())
  }

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

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setModalView({
      name: "CREATE_ROUND_REVIEW",
      cross: true,
      params: {
        name,
        tokenSymbol,
        tokenIssuance,
        reservedStake,
        description,
        website,
        twitter,
        discord,
        docs,
        duration,
        isTargetEth,
        target,
        isCapEth,
        cap,
        reservedError,
        success,
        addresses,
        shares,
        totalShares
      }
    })
  }

  return (
    <form className="space-y-6 text-left" onSubmit={submit}>
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
      <div className="pb-6">
        <Input
          type="range"
          label={
            <>
              Round token allocation: <b>{Number(reservedStake).toFixed(1)}%</b>
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
                    value={duration || ""}
                    onChange={setDuration}
                    placeholder="14"
                    question={
                      <>
                        <p>Choose how long will the round last.</p>
                        <p>Leave blank to set duration unlimited.</p>
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
                    value={target || ""}
                    onChange={setTarget}
                    placeholder={`Minimum ${
                      isTargetEth ? "ETH" : "USD"
                    } to raise`}
                    question={
                      <>
                        <p>
                          If the target is not reached before the duration, the
                          round will close and contributions can be fully
                          refunded.
                        </p>
                        <p>Leave blank to disable.</p>
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
                    value={cap || ""}
                    onChange={setCap}
                    placeholder={`Maximum ${isCapEth ? "ETH" : "USD"} to raise`}
                    question={
                      <>
                        <p>
                          Contributions will be rejected once the hard cap is
                          reached. This guarantees contributors{" "}
                          <b>a minimum guaranteed amount of reserved rate</b>.
                        </p>
                        <p>Leave blank to disable.</p>
                      </>
                    }
                  />
                </div>
              </div>
            </>
          }
        />
        <CollapsibleItem
          label="ERC20 token issuance"
          detail={
            <>
              <div className="py-3 space-y-6">
                <p>
                  Configure the token to be used for the project and the
                  quantity issued during the blunt round.
                </p>
                <div>
                  <Input
                    type="string"
                    label="Token symbol"
                    value={tokenSymbol}
                    onChange={handleSetTokenSymbol}
                    placeholder={
                      name
                        ? name
                            .replaceAll(/[^a-zA-Z]+/g, "")
                            .slice(0, 5)
                            .toUpperCase()
                        : "BLUNT"
                    }
                    question={
                      <>
                        Symbol of the ERC20 token to be issued for the project.
                        Tipically between 3 and 7 letters.
                      </>
                    }
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    label="Tokens issued per ETH"
                    min={0}
                    value={tokenIssuance != 0 ? tokenIssuance : ""}
                    onChange={setTokenIssuance}
                    placeholder="1000000"
                    question={
                      <>
                        Number of tokens to issue per ETH contributed during the
                        blunt round.
                      </>
                    }
                    questionPosition="bottom-[-4px] left-0 xs:left-[-96px]"
                  />
                </div>
              </div>
            </>
          }
        />
        <CollapsibleItem
          label="Customize reserved rate"
          error={reservedError}
          detail={
            <>
              <div className="py-3 space-y-6">
                <p>
                  Add beneficiaries to the reserved rate in addition to the
                  blunt round participants.
                </p>
                <ReservedBlockSplitter
                  addresses={addresses}
                  shares={shares}
                  reservedStake={reservedStake}
                  totalShares={totalShares}
                  setAddresses={setAddresses}
                  setShares={setShares}
                  setTotalShares={setTotalShares}
                  setReservedError={setReservedError}
                />
              </div>
            </>
          }
        />
        <CollapsibleItem
          label="Project links"
          detail={
            <>
              <div className="py-3 space-y-6">
                <p>Add website and social links to your project</p>
                {/* 
                <div>
                  <Input
                    type="string"
                    label="Logo"
                    value={website}
                    onChange={setWebsite}
                    placeholder="https://blunt.finance"
                  />
                </div> 
                */}
                <div>
                  <Input
                    type="string"
                    label="Website"
                    value={website}
                    onChange={setWebsite}
                    placeholder="https://blunt.finance"
                  />
                </div>
                <div>
                  <Input
                    type="string"
                    label="Twitter"
                    value={twitter}
                    onChange={setTwitter}
                    placeholder="@bluntfinance"
                  />
                </div>
                <div>
                  <Input
                    type="string"
                    label="Discord"
                    value={discord}
                    onChange={setDiscord}
                    placeholder="https://discord.gg/bluntfinance"
                  />
                </div>
                <div>
                  <Input
                    type="string"
                    label="Docs"
                    value={docs}
                    onChange={setDocs}
                    placeholder="https://blunt.notion.site"
                  />
                </div>
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
        <Button label="Review" type="submit" />
      </div>
    </form>
  )
}

export default CreateRoundForm
