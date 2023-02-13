import Chevron from "@components/icons/Chevron"
import React, { Dispatch, SetStateAction } from "react"

type Props = {
  deadlineUnits: string
  setDeadlineUnits: Dispatch<SetStateAction<string>>
}

export const timeFrames = {
  days: 86400,
  minutes: 60
}

const InputDeadlineUnits = ({ deadlineUnits, setDeadlineUnits }: Props) => {
  return (
    <div className="relative flex items-center w-36">
      <select
        className="w-full py-2 pl-6 pr-4 text-black placeholder-gray-400 bg-white border border-gray-200 rounded-sm appearance-none focus:border-yellow-600 focus:outline-none peer disabled:text-gray-400 disabled:border-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed dark:disabled:bg-gray-700 dark:disabled:border-gray-700 dark:disabled:text-gray-500"
        value={deadlineUnits}
        onChange={(e) => setDeadlineUnits(e.target.value)}
      >
        <option value="days">Days</option>
        <option value="minutes">Minutes</option>
      </select>
      <div className="absolute right-[16px] mb-0.5 rotate-90 text-gray-600 w-3 h-3">
        <Chevron />
      </div>
    </div>
  )
}

export default InputDeadlineUnits
