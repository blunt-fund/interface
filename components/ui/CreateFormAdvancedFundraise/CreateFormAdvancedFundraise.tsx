import { Input } from "@components/ui"
import handleSetObject from "@utils/handleSetObject"
import React, { Dispatch, SetStateAction, useEffect } from "react"
import { RoundData } from "../CreateRoundForm/CreateRoundForm"
export type NewImage = { url: string; file: File }

type Props = {
  createRoundData: RoundData
  setRoundData: Dispatch<SetStateAction<RoundData>>
  targetError: boolean
}

const CreateFormAdvancedFundraise = ({
  createRoundData,
  setRoundData,
  targetError
}: Props) => {
  const { duration, target, cap, isFundraiseEth } = createRoundData

  const handleSetDuration = (value: number) => {
    handleSetObject("duration", value, createRoundData, setRoundData)
  }
  const handleSetTarget = (value: number) => {
    handleSetObject("target", value, createRoundData, setRoundData)
  }
  const handleSetCap = (value: number) => {
    handleSetObject("cap", value, createRoundData, setRoundData)
  }

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
          question={
            <>
              <p>Choose how long will the round last.</p>
              <p>Leave blank to set unlimited duration.</p>
            </>
          }
        />
      </div>
      <div>
        <Input
          type="number"
          label="Target"
          error={targetError}
          prefix={isFundraiseEth ? "Ξ" : "$"}
          // prefixAction={() =>
          //   setIsFundraiseEth((isFundraiseEth) => !isFundraiseEth)
          // }
          min={0}
          value={target || ""}
          onChange={handleSetTarget}
          placeholder={`Minimum ${isFundraiseEth ? "ETH" : "USD"} to raise`}
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
          error={targetError}
          prefix={isFundraiseEth ? "Ξ" : "$"}
          // prefixAction={() =>
          //   setIsFundraiseEth((isFundraiseEth) => !isFundraiseEth)
          // }
          min={0}
          value={cap || ""}
          onChange={handleSetCap}
          placeholder={`Maximum ${isFundraiseEth ? "ETH" : "USD"} to raise`}
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
      {/* <p className="text-sm text-gray-600">
        Note: Target and cap need to be in the same currency
      </p> */}
      {targetError && (
        <p className="text-sm text-red-500">
          Target cannot be higher than hard cap
        </p>
      )}
    </div>
  )
}

export default CreateFormAdvancedFundraise
