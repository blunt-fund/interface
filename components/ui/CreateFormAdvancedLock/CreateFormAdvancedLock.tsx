import { Input, NoteText } from "@components/ui"
import handleSetObject from "@utils/handleSetObject"
import React, { Dispatch, SetStateAction } from "react"
import { RoundData } from "utils/getRounds"
export type NewImage = { url: string; file: File }

type Props = {
  roundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
  transferLockDate: Date
  releaseLockDate: Date
  roundLockDate: Date
}

const CreateFormAdvancedLock = ({
  roundData,
  setRoundData,
  transferLockDate,
  releaseLockDate,
  roundLockDate
}: Props) => {
  const {
    transferTimelock,
    releaseTimelock,
    roundTimelock,
    isSlicerToBeCreated: enforceSlicerCreation,
    shares
  } = roundData

  const handleSetTransferTimelock = (value: number) => {
    handleSetObject("transferTimelock", value, roundData, setRoundData)
  }
  const handleSetReleaseTimelock = (value: number) => {
    handleSetObject("releaseTimelock", value, roundData, setRoundData)
  }
  const handleSetRoundTimelock = (value: number) => {
    handleSetObject("roundTimelock", value, roundData, setRoundData)
  }

  const isSlicerNotToBeCreated = !enforceSlicerCreation && shares[0] == 0

  return (
    <div className="py-3 space-y-8">
      <p>
        Lock slice transfers, token withdrawals and modifications to the blunt
        round allocation.
      </p>
      <div className="relative">
        <Input
          type="number"
          label="Slice transfer lock (days)"
          min={0}
          value={transferTimelock != 0 ? transferTimelock : ""}
          onChange={handleSetTransferTimelock}
          placeholder="Leave blank to disable"
          disabled={isSlicerNotToBeCreated}
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
        {transferTimelock != 0 && (
          <p className="absolute text-xs left-0 bottom-[-20px]">
            Unlock date:{" "}
            <span className="font-bold text-yellow-600">
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
          value={releaseTimelock != 0 ? releaseTimelock : ""}
          onChange={handleSetReleaseTimelock}
          placeholder="Leave blank to disable"
          disabled={isSlicerNotToBeCreated}
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
        {releaseTimelock != 0 && (
          <p className="absolute text-xs left-0 bottom-[-20px]">
            Unlock date:{" "}
            <span className="font-bold text-yellow-600">
              {releaseLockDate.toLocaleDateString()}
            </span>
          </p>
        )}
      </div>
      {isSlicerNotToBeCreated && (
        <NoteText text='Set a round allocation or enable "Create slicer" to enable transfer / withdraw locks' />
      )}
      <div className="relative">
        <Input
          type="number"
          label="Round allocation lock (days)"
          min={0}
          value={roundTimelock != 0 ? roundTimelock : ""}
          onChange={handleSetRoundTimelock}
          placeholder="Leave blank to disable"
          disabled={shares[0] == 0}
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
        {roundTimelock != 0 && (
          <p className="absolute text-xs left-0 bottom-[-20px]">
            Unlock date:{" "}
            <span className="font-bold text-yellow-600">
              {roundLockDate.toLocaleDateString()}
            </span>
          </p>
        )}
      </div>
      {shares[0] == 0 && (
        <NoteText text="Set a round allocation to enable the allocation lock" />
      )}
    </div>
  )
}

export default CreateFormAdvancedLock

// TODO: Change timestamp to date or smt more friendly than unix timestamps
