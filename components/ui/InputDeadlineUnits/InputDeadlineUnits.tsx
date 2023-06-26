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
    <div className="relative flex w-36 items-center">
      <select
        className="peer w-full appearance-none rounded-sm border py-2 pl-6 pr-4 placeholder-gray-400 text-black bg-white border-gray-200 focus:outline-none focus:border-yellow-600 disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-200 disabled:border-gray-200 dark:disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:border-gray-700"
        value={deadlineUnits}
        onChange={(e) => setDeadlineUnits(e.target.value)}
      >
        <option value="days">Days</option>
        <option value="minutes">Minutes</option>
      </select>
      <div className="absolute right-[16px] mb-0.5 h-3 w-3 rotate-90 text-gray-600">
        <Chevron />
      </div>
    </div>
  )
}

export default InputDeadlineUnits
