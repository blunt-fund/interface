import { Container, Social } from "@components/ui"
import { accounts } from "../Social/Social"

const Footer = () => {
  return (
    <footer className="relative z-20 py-8 text-center bg-white shadow-sm">
      <Container>
        <Social wrapperClassName="flex justify-center" accounts={accounts} />

        <p className="pt-6 text-sm font-bold text-gray-300">
          bluntly simple fundraising
        </p>
      </Container>
    </footer>
  )
}

export default Footer
