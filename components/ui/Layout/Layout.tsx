import { Footer, Navbar } from "@components/ui"
import { useAppContext } from "@components/ui/context"
import dynamic from "next/dynamic"
import { useEffect } from "react"
import { useNetwork } from "wagmi"

const Modal = dynamic(() => import("@components/ui/Modal"), {
  ssr: false
})

export interface Props {
  line?: boolean
}

export default function Layout({ children }) {
  const { account, modalView, setModalView } = useAppContext()
  const { chain } = useNetwork()

  useEffect(() => {
    if (
      account &&
      chain &&
      Number(chain.id).toString(16) !== process.env.NEXT_PUBLIC_CHAIN_ID
    ) {
      setModalView({ cross: false, name: "NETWORK_VIEW" })
    } else {
      if (modalView.name == "NETWORK_VIEW") {
        setModalView({ name: "" })
      }
    }
  }, [account, chain])

  return (
    <>
      <div className="relative flex min-h-screen flex-col justify-between">
        <Navbar />
        {children}
        <Footer />
        {modalView.name && (
          <Modal modalView={modalView} setModalView={setModalView} />
        )}
      </div>
    </>
  )
}
