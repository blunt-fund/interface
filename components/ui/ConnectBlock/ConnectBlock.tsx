import { CustomConnectButton } from "@components/ui"
import { useAppContext } from "@components/ui/context"
import va from "@vercel/analytics"

const ConnectBlock = ({ children }) => {
  const { isConnected } = useAppContext()
  return isConnected ? (
    children
  ) : (
    <>
      <div className="mx-auto flex max-w-screen-xs flex-col items-center py-6">
        <h1>Log in</h1>
        <p className="py-10 text-gray-600 sm:text-lg">
          Connect your wallet to view this page
        </p>
        <div onClick={() => va.track("connect_wallet_attempt")}>
          <CustomConnectButton />
        </div>
      </div>
    </>
  )
}

export default ConnectBlock
