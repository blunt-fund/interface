import QuestionMark from "@components/icons/QuestionMark"
import { useState } from "react"

type Props = {
  text: string | JSX.Element
  position?: string
}

export default function Question({ text, position }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <div
        className={`${
          !show ? "hidden " : ""
        }prose absolute z-10 w-[21.5rem] p-4 text-left text-sm shadow-md bg-white xs:w-[26rem] ${
          position || "bottom-0 left-0"
        } mb-9 overflow-hidden rounded-sm border border-yellow-600`}
      >
        {text}
      </div>
      <div className="p-2 text-gray-600">
        <QuestionMark />
      </div>
    </div>
  )
}
