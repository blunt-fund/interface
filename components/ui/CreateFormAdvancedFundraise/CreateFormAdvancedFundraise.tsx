import { Input } from "@components/ui"
import React, { Dispatch, SetStateAction } from "react"
export type NewImage = { url: string; file: File }

type Props = {
  duration: number
  target: number
  cap: number
  isTargetEth: boolean
  isCapEth: boolean
  setDuration: Dispatch<SetStateAction<number>>
  setTarget: Dispatch<SetStateAction<number>>
  setCap: Dispatch<SetStateAction<number>>
  setIsTargetEth: Dispatch<SetStateAction<boolean>>
  setIsCapEth: Dispatch<SetStateAction<boolean>>
}

const CreateFormAdvancedFundraise = ({
  duration,
  isTargetEth,
  target,
  isCapEth,
  cap,
  setDuration,
  setIsTargetEth,
  setTarget,
  setIsCapEth,
  setCap
}: Props) => {
  return (
    <div className="py-3 space-y-6">
      <p>
        Blunt rounds are unlimited, uncapped and without target by default.
        Customize your round by specifying them below
      </p>
      <div>
        <Input
          type="number"
          label="Fundraise duration (days)"
          min={0}
          value={duration || ""}
          onChange={setDuration}
          placeholder="Leave blank for unlimited"
          question={
            <>
              <p>Choose how long will the round last.</p>
              <p>Leave blank to set duration unlimited.</p>
            </>
          }
        />
      </div>
      <div>
        <Input
          type="number"
          label="Target"
          prefix={isTargetEth ? "Ξ" : "$"}
          prefixAction={() => setIsTargetEth((isTargetEth) => !isTargetEth)}
          min={0}
          value={target || ""}
          onChange={setTarget}
          placeholder={`Minimum ${isTargetEth ? "ETH" : "USD"} to raise`}
          question={
            <>
              <p>
                If the target is not reached before the duration, the round will
                close and contributions can be fully refunded.
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
          prefix={isCapEth ? "Ξ" : "$"}
          prefixAction={() => setIsCapEth((isCapEth) => !isCapEth)}
          min={0}
          value={cap || ""}
          onChange={setCap}
          placeholder={`Maximum ${isCapEth ? "ETH" : "USD"} to raise`}
          question={
            <>
              <p>
                Contributions will be rejected once the hard cap is reached.
                This guarantees contributors{" "}
                <b>a minimum guaranteed amount of reserved rate</b>.
              </p>
              <p>Leave blank to disable.</p>
            </>
          }
        />
      </div>
    </div>
  )
}

export default CreateFormAdvancedFundraise
