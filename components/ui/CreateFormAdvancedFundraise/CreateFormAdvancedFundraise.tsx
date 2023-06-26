import {
  Input,
  InputAddress,
  InputDeadlineUnits,
  NoteText
} from "@components/ui"
import handleSetObject from "@utils/handleSetObject"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { RoundData } from "utils/getRounds"
import { useAppContext } from "../context"
import { timeFrames } from "../InputDeadlineUnits/InputDeadlineUnits"

export type NewImage = { url: string; file: File }

type Props = {
  roundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
  targetError: boolean
  riskMargin: number
}

const CreateFormAdvancedFundraise = ({
  roundData,
  setRoundData,
  targetError,
  riskMargin
}: Props) => {
  const { account } = useAppContext()
  const { deadline, target, cap, isTargetUsd, isHardcapUsd, projectOwner } =
    roundData

  const [address, setAddress] = useState("")
  const [resolvedAddress, setResolvedAddress] = useState("")
  const [deadlineUnits, setDeadlineUnits] = useState("days")

  const handleSetDeadline = (value: number) => {
    const formattedValue = value * timeFrames[deadlineUnits]
    handleSetObject("deadline", formattedValue, roundData, setRoundData)
  }
  const handleSetTarget = (value: number) => {
    handleSetObject("target", value, roundData, setRoundData)
  }
  const handleSetCap = (value: number) => {
    handleSetObject("cap", value, roundData, setRoundData)
  }
  const handleSetUsd = (property: string, value: boolean) => {
    handleSetObject(property, value, roundData, setRoundData)
  }
  const handleSetOwner = (value: string) => {
    setAddress(value)
    if (resolvedAddress === "Invalid ENS name") {
      handleSetObject("projectOwner", "", roundData, setRoundData)
    } else {
      handleSetObject("projectOwner", value, roundData, setRoundData)
    }
  }

  const isUsdEnabled = process.env.NEXT_PUBLIC_CHAIN_ID === "1"

  useEffect(() => {
    if (!address) {
      setAddress(account)
      handleSetObject("projectOwner", account, roundData, setRoundData)
    }
  }, [account])

  return (
    <div className="space-y-8 py-3">
      {/* <p>
        Blunt rounds are unlimited in duration, uncapped and without target by
        default.
      </p> */}
      <div className="relative flex items-end gap-4">
        <div className="flex-grow">
          <Input
            type="number"
            label="Round duration"
            min={0}
            value={
              Number(deadline)
                ? Math.round(
                    (Number(deadline) / timeFrames[deadlineUnits]) * 100
                  ) / 100
                : ""
            }
            step={deadlineUnits == "days" ? 0.01 : 0.1}
            onChange={handleSetDeadline}
            placeholder="Leave blank for unlimited"
            question={
              <>
                <p>How long to accept contributions for.</p>
                <p>Leave blank for an unlimited duration.</p>
                <p className="text-yellow-600">
                  Note: If you don&apos;t set a duration now, you can add one
                  during the round.
                </p>
              </>
            }
          />
        </div>
        <InputDeadlineUnits
          deadlineUnits={deadlineUnits}
          setDeadlineUnits={setDeadlineUnits}
        />
      </div>
      <div>
        <Input
          type="number"
          label="Fundraise target"
          error={targetError}
          prefix={isTargetUsd ? "$" : "Ξ"}
          prefixAction={() =>
            isUsdEnabled && handleSetUsd("isTargetUsd", !isTargetUsd)
          }
          min={0}
          step={isTargetUsd ? 1 : 0.1}
          value={target || ""}
          onChange={handleSetTarget}
          placeholder="Leave blank to disable"
          helptext={`Minimum ${isTargetUsd ? "USD" : "ETH"} amount to raise. 
          ${
            !isUsdEnabled
              ? "Note that on Mainnet you'll also be able to select USD"
              : ""
          }`}
          question={
            <>
              <p>
                If the target is not met before the deadline, all contributions
                can be fully refunded.
              </p>
              <p>Leave blank to disable.</p>
              <p className="text-yellow-600">
                Hint: Toggle between ETH and USD by clicking on the currency
                icon
              </p>
            </>
          }
        />
      </div>
      <div>
        <Input
          type="number"
          label="Hard cap"
          error={targetError}
          prefix={isHardcapUsd ? "$" : "Ξ"}
          prefixAction={() =>
            isUsdEnabled && handleSetUsd("isHardcapUsd", !isHardcapUsd)
          }
          min={0}
          step={isHardcapUsd ? 1 : 0.1}
          value={cap || ""}
          onChange={handleSetCap}
          placeholder="Leave blank to disable"
          helptext={`Maximum ${isHardcapUsd ? "USD" : "ETH"} to raise. 
          ${
            !isUsdEnabled
              ? "Note that on Mainnet you'll also be able to select USD"
              : ""
          }`}
          question={
            <>
              <p>Contributions will be rejected once the cap is met.</p>
              {/* <p>
                If a slicer is to be created, it limits ownership dilution among
                round participants.
              </p> */}
              <p>Leave blank to disable.</p>
              <p className="text-yellow-600">
                Hint: Toggle between ETH and USD by clicking on the currency
                icon
              </p>
            </>
          }
        />
      </div>
      {targetError && (
        <NoteText error text="Cap needs to be higher than target" />
      )}
      {cap != 0 &&
        !targetError &&
        isTargetUsd != isHardcapUsd &&
        riskMargin > 0.5 && (
          <NoteText text="Target value is close to the cap. Consider using the same currency for both, or increasing the cap / lowering the target." />
        )}
      <div className="pb-2">
        <InputAddress
          label="Project owner"
          address={address as `0x${string}`}
          onChange={handleSetOwner}
          question={
            <>
              <p>
                The project owner is responsible for closing the blunt round.
              </p>
              <p>
                If the funding target is met when the round is closed, ownership
                of the funds will be transferred to this address.
              </p>
            </>
          }
          helptext="The future owner of the Juicebox project if the round is successful"
          required
          resolvedAddress={resolvedAddress}
          setResolvedAddress={setResolvedAddress}
        />
      </div>
    </div>
  )
}

export default CreateFormAdvancedFundraise
