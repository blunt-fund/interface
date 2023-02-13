import Chevron from "@components/icons/Chevron"
import { Input, InputAddress, NoteText } from "@components/ui"
import handleSetObject from "@utils/handleSetObject"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { RoundData } from "utils/getRounds"
export type NewImage = { url: string; file: File }

type Props = {
  roundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
  targetError: boolean
  riskMargin: number
}

export const timeFrames = {
  days: 86400,
  minutes: 60
}

const CreateFormAdvancedFundraise = ({
  roundData,
  setRoundData,
  targetError,
  riskMargin
}: Props) => {
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

  useEffect(() => {
    if (projectOwner) setAddress(projectOwner)
  }, [])

  useEffect(() => {
    if (resolvedAddress && resolvedAddress != "Invalid ENS name") {
      let newProjectOwner: string
      if (resolvedAddress.substring(resolvedAddress.length - 4) !== ".eth") {
        newProjectOwner = resolvedAddress
      } else {
        newProjectOwner = address
      }
      handleSetObject("projectOwner", newProjectOwner, roundData, setRoundData)
    }
  }, [resolvedAddress])

  return (
    <div className="py-3 space-y-8">
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
                <p>The period of time in which contributions are accepted.</p>
                <p>Leave blank to set unlimited duration.</p>
                <p className="text-yellow-600">
                  Note: If not set, you will be able to set it while the round
                  is in progress.
                </p>
              </>
            }
          />
        </div>
        <div className="relative flex items-center w-36">
          <select
            className="w-full py-2 pl-6 pr-4 text-black placeholder-gray-400 bg-white border border-gray-200 rounded-sm appearance-none focus:border-yellow-600 focus:outline-none peer disabled:text-gray-400 disabled:border-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed dark:disabled:bg-gray-700 dark:disabled:border-gray-700 dark:disabled:text-gray-500"
            value={deadlineUnits}
            onChange={(e) => setDeadlineUnits(e.target.value)}
          >
            <option value="days">Days</option>
            <option value="minutes">Minutes</option>
          </select>
          <div className="absolute right-[16px] mb-0.5 rotate-90 text-gray-600 w-3 h-3">
            <Chevron />
          </div>
        </div>
      </div>
      <div>
        <Input
          type="number"
          label="Fundraise target"
          error={targetError}
          prefix={isTargetUsd ? "$" : "Ξ"}
          prefixAction={() => handleSetUsd("isTargetUsd", !isTargetUsd)}
          min={0}
          step={isTargetUsd ? 1 : 0.1}
          value={target || ""}
          onChange={handleSetTarget}
          placeholder="Leave blank to disable"
          helptext={`Minimum ${isTargetUsd ? "USD" : "ETH"} to raise. 
          ${
            process.env.NEXT_PUBLIC_CHAIN_ID == "5"
              ? "Note that USD / ETH on Goerli is different than on mainnet"
              : ""
          }`}
          question={
            <>
              <p>
                If the target is not reached before the deadline, all
                contributions can be fully refunded.
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
          prefixAction={() => handleSetUsd("isHardcapUsd", !isHardcapUsd)}
          min={0}
          step={isHardcapUsd ? 1 : 0.1}
          value={cap || ""}
          onChange={handleSetCap}
          placeholder="Leave blank to disable"
          helptext={`Maximum ${isHardcapUsd ? "USD" : "ETH"} to raise. 
          ${
            process.env.NEXT_PUBLIC_CHAIN_ID == "5"
              ? "Note that USD / ETH on Goerli is different than on mainnet"
              : ""
          }`}
          question={
            <>
              <p>Contributions will be rejected once the cap is reached.</p>
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
          address={address}
          onChange={setAddress}
          question={
            <>
              <p>
                The project owner is responsible for closing the blunt round.
              </p>
              <p>
                If the funding target has been reached when the round is closed,
                ownership of the JB project will be transferred to this account.
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
