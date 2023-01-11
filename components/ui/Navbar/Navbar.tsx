import Link from "next/link"
import Logo from "@components/icons/Logo"
import { Container, CustomConnectButton, DropdownMenu } from "@components/ui"
import saEvent from "@utils/saEvent"
import Nightwind from "@components/icons/Nightwind"
import { useAppContext } from "../context"
import { useEffect, useRef, useState } from "react"
import UserIcon from "@components/icons/UserIcon"

const Navbar = () => {
  const { isConnected } = useAppContext()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClick)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClick)
    }
  }, [dropdownRef])

  return (
    <header className="shadow-sm">
      <Container>
        <nav className="relative px-3 sm:px-6 h-[4.25rem] items-center mx-auto flex justify-between">
          <div className="flex items-center space-x-5 sm:space-x-10">
            <Link href="/">
              <a className="w-7 h-7" aria-label="Blunt Finance logo">
                <Logo />
              </a>
            </Link>
            <Link href="/rounds">
              <a className="text-sm">Explore</a>
            </Link>
          </div>

          <div className="relative z-10 flex items-center space-x-5 xs:space-x-6">
            <div className="hidden xs:block xs:mr-2">
              <Nightwind size="h-[24px]" />
            </div>
            <div onClick={() => saEvent("connect_wallet_attempt")}>
              <CustomConnectButton />
            </div>
            {isConnected && (
              <a
                // TODO: Fix click on icon when dropdown is open
                onClick={() => setShowDropdown((showDropdown) => !showDropdown)}
                ref={dropdownRef}
              >
                <UserIcon />
              </a>
            )}
          </div>
          {showDropdown && (
            <div className="absolute top-0 right-0" ref={dropdownRef}>
              <DropdownMenu setShowDropdown={setShowDropdown} />
            </div>
          )}
        </nav>
      </Container>
      <hr className="w-full border-gray-200" />
    </header>
  )
}

export default Navbar
