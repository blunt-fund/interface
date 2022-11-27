import { Input, MySwitch, Textarea } from "@components/ui"
import handleSetObject from "@utils/handleSetObject"
import React, { Dispatch, SetStateAction, useState } from "react"
import { RoundData } from "utils/getRounds"

type Props = {
  roundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
}

const CreateFormGeneral = ({ roundData, setRoundData }: Props) => {
  const { name, description, shares, isSlicerToBeCreated } = roundData

  const handleSetName = (value: string) => {
    handleSetObject("name", value, roundData, setRoundData)
  }
  const handleSetDescription = (value: string) => {
    handleSetObject("description", value, roundData, setRoundData)
  }
  const handleSetIsSlicerToBeCreated = (value: boolean) => {
    handleSetObject("isSlicerToBeCreated", value, roundData, setRoundData)
  }

  const handleSetReservedStake = (value: number) => {
    const items = [...shares]
    items[0] = value
    handleSetObject("shares", items, roundData, setRoundData)
  }

  return (
    <>
      <div>
        <Input
          label="Project name"
          value={name}
          onChange={handleSetName}
          required
        />
      </div>
      <div>
        <Textarea
          label="Project description"
          value={description}
          onChange={handleSetDescription}
          rows={5}
          required
        />
      </div>
      <div className="pb-6">
        <Input
          type="range"
          label={
            <>
              Round token allocation: <b>{Number(shares[0]).toFixed(1)}%</b>
            </>
          }
          min={0}
          max={100}
          step={0.5}
          value={shares[0]}
          onChange={handleSetReservedStake}
          question={
            <>
              Percentage of future issued tokens shared between the round
              participants.
            </>
          }
        />
      </div>
      {shares[0] == 0 && (
        <MySwitch
          enabled={isSlicerToBeCreated}
          setEnabled={handleSetIsSlicerToBeCreated}
          label="Create slicer"
          question={
            <>
              <p>
                Enable to create a slicer and allow round participants to claim
                slices once the round ends successfully.
              </p>
              <p>
                Can be used to later split payments and tokens among
                contributors.
              </p>
            </>
          }
          alignRight
        />
      )}
    </>
  )
}

export default CreateFormGeneral
