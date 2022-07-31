import { Button } from "@components/ui"
import { useAppContext } from "@components/ui/context"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import saEvent from "@utils/saEvent"

const ConnectBlock = ({ children }) => {
  const { isConnected } = useAppContext()
  return isConnected ? (
    children
  ) : (
    <>
      <div className="flex flex-col items-center py-6 mx-auto max-w-screen-xs">
        <h1>Connect your wallet</h1>
        <p className="py-10 text-lg">
          You need to connect your wallet to view this page.
        </p>
        <div onClick={() => saEvent("connect_wallet_attempt")}>
          <ConnectButton />
        </div>
      </div>
    </>
  )
}

export default ConnectBlock
