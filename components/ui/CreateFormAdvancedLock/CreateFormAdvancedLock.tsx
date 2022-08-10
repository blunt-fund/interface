import { Input } from "@components/ui"
import React, { Dispatch, SetStateAction, useEffect } from "react"
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
        Slices are ERC1155 tokens which represent ownership over the blunt round
        and cannot be transferred until the round closes.
      </p>
      <p>
        Optionally, you can also lock transfer and / or token releases for a
        period of time.
      </p>
      <div className="relative">
        <Input
          type="number"
          label="Slice transfer lock (days)"
          min={0}
          value={transferTimeLock || ""}
          onChange={setTransferTimeLock}
          placeholder="Leave blank for unlocked transfers"
          question={
            <>
              <p>Leave blank to allow transfers at any time.</p>
            </>
          }
        />
        {transferTimeLock != 0 && (
          <p className="absolute text-xs left-0 bottom-[-20px]">
            Lock date:{" "}
            <span className="font-bold text-blue-600">
              {transferLockDate.toLocaleDateString()}
            </span>
          </p>
        )}
      </div>
      <div className="relative">
        <Input
          type="number"
          label="Token release lock (days)"
          min={0}
          value={releaseTimeLock || ""}
          onChange={setReleaseTimeLock}
          placeholder="Leave blank for unlocked token releases"
          question={
            <>
              <p>Leave blank to allow token releases at any time.</p>
            </>
          }
        />
        {releaseTimeLock != 0 && (
          <p className="absolute text-xs left-0 bottom-[-20px]">
            Lock date:{" "}
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
