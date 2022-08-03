import Link from "next/link"
import Logo from "@components/icons/Logo"
import { Container, CustomConnectButton } from "@components/ui"
import saEvent from "@utils/saEvent"
import Nightwind from "@components/icons/Nightwind"

const Navbar = () => {
  return (
    <header className="shadow-md">
      <Container>
        <nav className="relative px-3 sm:px-6 h-[4.25rem] items-center mx-auto flex justify-between">
          <div className="flex items-center space-x-7 sm:space-x-10">
            <Link href="/">
              <a className="mb-1" aria-label="Slice logo">
                <Logo size="w-[24px]" />
              </a>
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <Nightwind size="h-[24px]" />
            <div onClick={() => saEvent("connect_wallet_attempt")}>
              <CustomConnectButton />
            </div>
          </div>
        </nav>
      </Container>
      <hr className="w-full border-gray-200" />
    </header>
  )
}

export default Navbar
