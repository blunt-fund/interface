import Logo from "@components/icons/Logo"
import Nightwind from "@components/icons/Nightwind"
import UserIcon from "@components/icons/UserIcon"
import { Container, CustomConnectButton, DropdownMenu } from "@components/ui"
import va from "@vercel/analytics"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useAppContext } from "../context"

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
        <nav className="relative mx-auto flex h-[4.25rem] items-center justify-between px-3 sm:px-6">
          <div className="flex items-center space-x-5 sm:space-x-10">
            <Link href="/" className="h-7 w-7" aria-label="Blunt logo">
              <Logo />
            </Link>
            <Link href="/rounds" className="text-sm font-bold">
              Explore
            </Link>
          </div>

          <div className="relative z-10 flex items-center space-x-5 xs:space-x-6">
            <div className="hidden xs:mr-2 xs:block">
              <Nightwind size="h-[24px]" />
            </div>
            <div onClick={() => va.track("connect_wallet_attempt")}>
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
