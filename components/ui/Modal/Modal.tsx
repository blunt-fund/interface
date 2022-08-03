import Cross from "@components/icons/Cross"
import { Dispatch, SetStateAction } from "react"
import { View, ROUND_INFO_VIEW } from "@lib/content/modals"

type Props = {
  modalView: View
  setModalView: Dispatch<SetStateAction<View>>
}

const Modal = ({ modalView, setModalView }: Props) => {
  let content: JSX.Element
  const { name, cross, params } = modalView

  switch (name) {
    case "ROUND_INFO_VIEW":
      content = ROUND_INFO_VIEW()
      break
  }

  return (
    <div className="fixed top-0 z-50 w-screen h-screen py-12 overflow-y-scroll xs:py-20 background-modal">
      <div
        className="absolute w-full h-full mt-[-3rem] xs:mt-[-5rem]"
        onClick={() => (cross ? setModalView({ name: "" }) : null)}
      />
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "100%" }}
      >
        <div className="relative w-full max-w-screen-sm px-2 py-16 mx-2 bg-white shadow-xl xs:py-20 xs:px-8 rounded-xl">
          {cross && (
            <div className="absolute top-[24px] right-[24px]">
              <Cross
                className="text-right cursor-pointer hover:text-red-500"
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
