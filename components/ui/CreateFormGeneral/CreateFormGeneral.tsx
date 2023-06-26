import { Input } from "@components/ui"
import handleSetObject from "@utils/handleSetObject"
import React, { Dispatch, SetStateAction } from "react"
import { RoundData } from "utils/getRounds"

type Props = {
  roundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
}

const CreateFormGeneral = ({ roundData, setRoundData }: Props) => {
  const { name, shares, isSlicerToBeCreated } = roundData

  const handleSetName = (value: string) => {
    handleSetObject("name", value, roundData, setRoundData)
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
      {/* <div className="pb-6">
        <Input
          type="range"
          label={
            <>
              Round allocation: <b>{Number(shares[0]).toFixed(1)}%</b>
            </>
          }
          min={0}
          max={100}
          step={0.5}
          value={shares[0]}
          onChange={handleSetReservedStake}
          question={
            <>
              Percentage of future token issuance to split between the blunt round
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
                Can be used later to split payments and tokens between
                contributors.
              </p>
            </>
          }
          alignRight
        />
      )} */}
    </>
  )
}

export default CreateFormGeneral
