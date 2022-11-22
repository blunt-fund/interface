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
        Lock slice transfers, token withdrawals and modifications to the blunt
        round allocation.
      </p>
      <div className="relative">
        <Input
          type="number"
          label="Slice transfer lock (days)"
          min={0}
          value={transferTimeLock != 0 ? transferTimeLock : ""}
          onChange={handleSetTransferTimeLock}
          placeholder="Leave blank to disable"
          question={
            <>
              <p>
                Slices are the ERC1155 tokens representing ownership over the
                blunt round slicer.
              </p>
              <p>
                By default, slices are transferable. This lock prevents round
                participants to transfer or trade their slices until the
                specified date.
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
          label="Token withdrawals lock (days)"
          min={0}
          value={releaseTimeLock != 0 ? releaseTimeLock : ""}
          onChange={handleSetReleaseTimeLock}
          placeholder="Leave blank to disable"
          question={
            <>
              <p>
                This lock prevents round participants to withdraw any currency
                earned by the slicer until the specified date, including the
                project tokens reserved for the round allocation.
              </p>
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
          min={0}
          value={roundTimeLock != 0 ? roundTimeLock : ""}
          onChange={handleSetRoundTimeLock}
          placeholder="Leave blank to disable"
          question={
            <>
              <p>
                This lock prevents the project owner to reduce the round token
                allocation by reconfiguring a future funding cycle.
              </p>
              <p>
                A longer timelock can act as assurance to prospective
                contributors.
              </p>
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
