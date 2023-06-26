import Cross from "@components/icons/Cross"
import {
  CREATE_ROUND_VIEW,
  NETWORK_VIEW,
  REDEEM_VIEW,
  REVIEW_ROUND_VIEW,
  ROUND_INFO_VIEW,
  View
} from "@lib/content/modals"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"

type Props = {
  modalView: View
  setModalView: Dispatch<SetStateAction<View>>
}

const Modal = ({ modalView, setModalView }: Props) => {
  let content: JSX.Element
  const { name, cross, params } = modalView
  const modalRef = useRef(null)

  switch (name) {
    case "NETWORK_VIEW":
      content = NETWORK_VIEW()
      break
    case "ROUND_INFO_VIEW":
      content = ROUND_INFO_VIEW()
      break
    case "REVIEW_ROUND_VIEW":
      content = REVIEW_ROUND_VIEW(params)
      break
    case "CREATE_ROUND_VIEW":
      content = CREATE_ROUND_VIEW(params)
      break
    case "REDEEM_VIEW":
      content = REDEEM_VIEW(params)
      break
  }

  useEffect(() => {
    function handleClick(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalView({ name: "" })
      }
    }

    if (cross) {
      // Bind the event listener
      document.addEventListener("mousedown", handleClick)
    }

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClick)
    }
  }, [cross, modalRef, setModalView])

  return (
    <div className="background-modal fixed top-0 z-50 h-screen w-screen overflow-y-scroll py-12 xs:py-20">
      <div className="absolute mt-[-3rem] h-full w-full xs:mt-[-5rem]" />
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "100%" }}
      >
        <div
          className="relative mx-2 w-full max-w-screen-md rounded-sm border px-2 py-16 shadow-xl bg-white border-gray-200 xs:py-20 xs:px-8"
          ref={modalRef}
        >
          {cross && (
            <div className="absolute top-[24px] right-[24px]">
              <Cross
                className="cursor-pointer text-right hover:text-red-500"
                onClick={() => setModalView({ name: "" })}
              />
            </div>
          )}
          <div>{content}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal
