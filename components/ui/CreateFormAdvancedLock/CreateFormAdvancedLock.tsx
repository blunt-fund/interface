import { Input } from "@components/ui"
import handleSetObject from "@utils/handleSetObject"
import React, { Dispatch, SetStateAction } from "react"
import { RoundData } from "../CreateRoundForm/CreateRoundForm"
export type NewImage = { url: string; file: File }

type Props = {
  createRoundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
  transferLockDate: Date
  releaseLockDate: Date
  roundLockDate: Date
}

const CreateFormAdvancedLock = ({
  createRoundData,
  setRoundData,
  transferLockDate,
  releaseLockDate,
  roundLockDate
}: Props) => {
  const { transferTimeLock, releaseTimeLock, roundTimeLock } = createRoundData

  const handleSetTransferTimeLock = (value: number) => {
    handleSetObject("transferTimeLock", value, createRoundData, setRoundData)
  }
  const handleSetReleaseTimeLock = (value: number) => {
    handleSetObject("releaseTimeLock", value, createRoundData, setRoundData)
  }
  const handleSetRoundTimeLock = (value: number) => {
    handleSetObject("roundTimeLock", value, createRoundData, setRoundData)
  }

  return (
    <div className="py-3 space-y-6">
      <p>
        Lock slice transfers, token withdrawals and future changes in the blunt
        round allocation.
      </p>
      <div className="relative">
        <Input
          type="number"
          label="Slice transfer lock (days)"
          min={0}
          value={transferTimeLock || ""}
          onChange={handleSetTransferTimeLock}
          placeholder="Leave blank to disable"
          question={
            <>
              <p>
                Slices are ERC1155 tokens which represent ownership over the
                slicer related to a blunt round.
              </p>
              <p>
                By default, round participants can transfer slices and trade
                them on NFT marketplaces.
              </p>
              <p>Leave blank to always allow slice transfers.</p>
            </>
          }
        />
        {transferTimeLock != 0 && (
          <p className="absolute text-xs left-0 bottom-[-20px]">
            Unlock date:{" "}
            <span className="font-bold text-blue-600">
              {transferLockDate.toLocaleDateString()}
            </span>
          </p>
        )}
      </div>
      <div className="relative">
        <Input
          type="number"
          label="Token withdrawal lock (days)"
          min={0}
          value={releaseTimeLock || ""}
          onChange={handleSetReleaseTimeLock}
          placeholder="Leave blank to disable"
          question={
            <>
              <p>Leave blank to always allow token withdrawals.</p>
            </>
          }
        />
        {releaseTimeLock != 0 && (
          <p className="absolute text-xs left-0 bottom-[-20px]">
            Unlock date:{" "}
            <span className="font-bold text-blue-600">
              {releaseLockDate.toLocaleDateString()}
            </span>
          </p>
        )}
      </div>
      <div className="relative">
        <Input
          type="number"
          label="Round token allocation lock (days)"
          helptext="Prevent reserved rate allocation for blunt round participants to be changed for a period of time."
          min={0}
          value={roundTimeLock || ""}
          onChange={handleSetRoundTimeLock}
          placeholder="Leave blank to disable"
          question={
            <>
              <p>A longer timelock can act as assurance to contributors.</p>
            </>
          }
        />
        {roundTimeLock != 0 && (
          <p className="absolute text-xs left-0 bottom-[-20px]">
            Unlock date:{" "}
            <span className="font-bold text-blue-600">
              {roundLockDate.toLocaleDateString()}
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

export default CreateFormAdvancedLock

// TODO: Change timestamp to date or smt more friendly than unix timestamps
