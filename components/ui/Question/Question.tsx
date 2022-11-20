import { useState } from "react"
import QuestionMark from "@components/icons/QuestionMark"

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
        }prose text-left text-sm absolute p-4 w-[21.5rem] xs:w-[26rem] z-10 bg-white shadow-md ${
          position || "bottom-0 left-0"
        } mb-9 rounded-sm overflow-hidden border border-blue-600`}
      >
        {text}
      </div>
      <div className="p-2 text-gray-600">
        <QuestionMark />
      </div>
    </div>
  )
}
