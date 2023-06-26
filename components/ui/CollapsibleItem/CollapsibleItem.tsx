import Alert from "@components/icons/Alert"
import Chevron from "@components/icons/Chevron"
import { useState } from "react"

type Props = {
  label: string
  detail: string | JSX.Element
  id?: string
  anchor?: string
  wrapperClassName?: string
  error?: boolean
  secondary?: boolean
}

const CollapsibleItem = ({
  label,
  detail,
  id,
  anchor,
  wrapperClassName,
  error,
  secondary
}: Props) => {
  const [showDetail, setShowDetail] = useState(id && anchor == id)
  return (
    <li>
      <div
        className={`group inline-flex cursor-pointer items-center ${
          wrapperClassName || ""
        } ${secondary ? "opacity-50" : ""}`}
        onClick={() => setShowDetail((showDetail) => !showDetail)}
        id={id || undefined}
      >
        <div className={`mr-4 h-4 w-4 flex-shrink-0 ${showDetail && "pb-2"}`}>
          <Chevron
            className={`duration-50 transition-transform ease-out ${
              showDetail
                ? "translate-x-[8px] rotate-180 group-hover:translate-x-[4px]"
                : "group-hover:translate-x-[4px]"
            } `}
          />
        </div>
        <p>{label}</p>
        {error && (
          <div className="ml-2 h-5 w-5 text-red-500">
            <Alert />
          </div>
        )}
      </div>
      {showDetail && (
        <div className="mt-3 border px-3 py-6 border-gray-200 xs:px-5">
          {typeof detail == "string" ? <p className="">{detail}</p> : detail}
        </div>
      )}
    </li>
  )
}

export default CollapsibleItem

// TODO: Fix react state update - useEffect should be used to handle init state of showDetail, but at the FAQs component. Preferable to not use at all.
