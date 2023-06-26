import Nightwind from "@components/icons/Nightwind"
import { useTheme } from "next-themes"
import nightwind from "nightwind/helper"
import { Dispatch, SetStateAction } from "react"
import { DropdownMenuElement } from ".."

function DropdownMenu({
  setShowDropdown
}: {
  setShowDropdown: Dispatch<SetStateAction<boolean>>
}) {
  const { theme, setTheme } = useTheme()

  const toggle = () => {
    nightwind.beforeTransition()
    if (theme !== "dark") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  return (
    <div
      className={`shadow-base nightwind-prevent-block absolute top-0 right-0 z-20 mt-20 w-56 space-y-1 rounded-sm border text-sm bg-white border-gray-200`}
    >
      <DropdownMenuElement
        href="/myrounds"
        image={
          <div className="h-5 w-5 rounded-full border-2 border-blue-600 group-hover:border-white" />
        }
        label="My rounds"
        onClick={() => setShowDropdown(false)}
      />
      <div className="xs:hidden">
        <DropdownMenuElement
          image={<Nightwind size="h-5" onClick={null} />}
          label="Toggle dark mode"
          onClick={() => {
            toggle()
            setShowDropdown(false)
          }}
        />
      </div>
    </div>
  )
}

export default DropdownMenu
