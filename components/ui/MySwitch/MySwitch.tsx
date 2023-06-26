import { Switch } from "@headlessui/react"
import { Dispatch, SetStateAction } from "react"
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
      relative inline-flex h-[26px] w-[52px] flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out border-transparent focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-[22px]" : "translate-x-0"}
        pointer-events-none inline-block h-[22px] w-[26px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out bg-white`}
        />
      </Switch>
    </div>
  )
}

export default MySwitch
