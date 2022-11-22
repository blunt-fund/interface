import { Input, InputAddress, NoteText } from "@components/ui"
import handleSetObject from "@utils/handleSetObject"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { RoundData } from "../CreateRoundForm/CreateRoundForm"
export type NewImage = { url: string; file: File }

type Props = {
  createRoundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
  targetError: boolean
  riskMargin: number
}

const CreateFormAdvancedFundraise = ({
  createRoundData,
  setRoundData,
  targetError,
  riskMargin
}: Props) => {
  const { duration, target, cap, isTargetEth, isCapEth, projectOwner } =
    createRoundData

  const [address, setAddress] = useState("")
  const [resolvedAddress, setResolvedAddress] = useState("")

  const handleSetDuration = (value: number) => {
    handleSetObject("duration", value, createRoundData, setRoundData)
  }
  const handleSetTarget = (value: number) => {
    handleSetObject("target", value, createRoundData, setRoundData)
  }
  const handleSetCap = (value: number) => {
    handleSetObject("cap", value, createRoundData, setRoundData)
  }
  const handleSetUsd = (property: string, value: boolean) => {
    handleSetObject(property, value, createRoundData, setRoundData)
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
      handleSetObject(
        "projectOwner",
        newProjectOwner,
        createRoundData,
        setRoundData
      )
    }
  }, [resolvedAddress])

  return (
    <div className="py-3 space-y-6">
      <p>
        Blunt rounds are unlimited in duration, uncapped and without target by
        default.
      </p>
      <div>
        <Input
          type="number"
          label="Fundraise duration (days)"
          min={0}
          value={duration || ""}
          onChange={handleSetDuration}
          placeholder="Leave blank for unlimited"
          question={<p>Leave blank to set unlimited duration.</p>}
        />
      </div>
      <div>
        <Input
          type="number"
          label="Target"
          error={targetError}
          prefix={isTargetEth ? "Ξ" : "$"}
          prefixAction={() => handleSetUsd("isTargetEth", !isTargetEth)}
          min={0}
          step={isTargetEth ? 0.1 : 1}
          value={target || ""}
          onChange={handleSetTarget}
          placeholder="Leave blank to disable"
          helptext={`Minimum ${isTargetEth ? "ETH" : "USD"} to raise`}
          question={
            <>
              <p>
                If the target is not reached in time, the round will close and
                all contributions can be fully refunded.
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
          error={targetError}
          prefix={isCapEth ? "Ξ" : "$"}
          prefixAction={() => handleSetUsd("isCapEth", !isCapEth)}
          min={0}
          step={isCapEth ? 0.1 : 1}
          value={cap || ""}
          onChange={handleSetCap}
          placeholder="Leave blank to disable"
          helptext={`Maximum ${isCapEth ? "ETH" : "USD"} to raise`}
          question={
            <>
              <p>Contributions will be rejected once the cap is reached.</p>
              <p>
                If a slicer is to be created, it limits ownership dilution among
                round participants.
              </p>
              <p>Leave blank to disable.</p>
            </>
          }
        />
      </div>
      {targetError && (
        <NoteText error text="Target cannot be higher than cap" />
      )}
      <NoteText text="Hint: Click on the currency icon to toggle between ETH and USD" />
      {!targetError && isTargetEth != isCapEth && riskMargin > 0.5 && (
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
