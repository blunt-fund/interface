import Link from "next/link"
import Logo from "@components/icons/Logo"
import { Container, CustomConnectButton, DropdownMenu } from "@components/ui"
import saEvent from "@utils/saEvent"
import Nightwind from "@components/icons/Nightwind"
import { useAppContext } from "../context"
import { useState } from "react"
import UserIcon from "@components/icons/UserIcon"

const Navbar = () => {
  const { isConnected } = useAppContext()
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header className="shadow-sm">
      <Container>
        <nav className="relative px-3 sm:px-6 h-[4.25rem] items-center mx-auto flex justify-between">
          <div className="flex items-center space-x-7 sm:space-x-10">
            <Link href="/">
              <a className="w-7 h-7" aria-label="Blunt Finance logo">
                <Logo />
              </a>
            </Link>
            <Link href="/explore">
              <a className="text-sm">Explore rounds</a>
            </Link>
          </div>

          <div className="relative z-10 flex items-center space-x-5 xs:space-x-6">
            <div className={`${isConnected ? "hidden xs:block xs:mr-2" : ""}`}>
              <Nightwind size="h-[24px]" />
            </div>
            <div onClick={() => saEvent("connect_wallet_attempt")}>
              <CustomConnectButton />
            </div>
            {isConnected && (
              <a
                onClick={() => setShowDropdown((showDropdown) => !showDropdown)}
              >
                <UserIcon />
              </a>
            )}
          </div>
          {showDropdown && (
            <DropdownMenu
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          )}
        </nav>
      </Container>
      <hr className="w-full border-gray-200" />
    </header>
  )
}

export default Navbar
