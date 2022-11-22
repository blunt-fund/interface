import { Dispatch, SetStateAction, useState } from "react"
import { Switch } from "@headlessui/react"
import Question from "../Question"

type Props = {
  enabled: boolean
  setEnabled: Dispatch<SetStateAction<boolean>> | { (): void }
  label?: string | JSX.Element
  question?: string | JSX.Element
  alignRight?: boolean
}

const MySwitch = ({
  enabled,
  setEnabled,
  label,
  question,
  alignRight
}: Props) => {
  return (
    <div
      className={`relative flex items-center gap-4 ${
        alignRight ? "justify-end" : ""
      }`}
    >
      {label && (
        <>
          <div className="flex items-center">
            <p className="pr-1">{label}</p>{" "}
            {question && (
              <Question
                position={alignRight && "bottom-0 right-0"}
                text={question}
              />
            )}
          </div>
        </>
      )}
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? "bg-green-500" : "bg-gray-800"}
      relative inline-flex flex-shrink-0 h-[26px] w-[52px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-[22px]" : "translate-x-0"}
        pointer-events-none inline-block h-[22px] w-[26px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
        />
      </Switch>
    </div>
  )
}

export default MySwitch
