import { Input } from "@components/ui"
import React, { Dispatch, SetStateAction } from "react"
export type NewImage = { url: string; file: File }

type Props = {
  transferTimeLock: number
  releaseTimeLock: number
  transferLockDate: Date
  releaseLockDate: Date
  setTransferTimeLock: Dispatch<SetStateAction<number>>
  setReleaseTimeLock: Dispatch<SetStateAction<number>>
}

const CreateFormAdvancedLock = ({
  transferTimeLock,
  releaseTimeLock,
  transferLockDate,
  releaseLockDate,
  setTransferTimeLock,
  setReleaseTimeLock
}: Props) => {
  return (
    <div className="py-3 space-y-6">
      <p>
        Slices are ERC1155 tokens representing ownership over the blunt round
        participants.
      </p>
      <p>
        You can decide to lock slice transfers and / or token withdrawals for a
        period of time.
      </p>
      <div className="relative">
        <Input
          type="number"
          label="Slice transfer lock (days)"
          min={0}
          value={transferTimeLock || ""}
          onChange={setTransferTimeLock}
          placeholder="Leave blank to disable"
          question={
            <>
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
          onChange={setReleaseTimeLock}
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
      <p className="pt-4 text-sm text-gray-600">
        Note: If a fundraise duration is set, locks are calculated after the
        round finishes.
      </p>
    </div>
  )
}

export default CreateFormAdvancedLock

// TODO: Change timestamp to date or smt more friendly than unix timestamps
