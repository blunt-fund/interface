import { ConnectButton } from "@rainbow-me/rainbowkit"
import Button from "../Button"

const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted
      }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none"
              }
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button
                    label="Connect Wallet"
                    onClick={openConnectModal}
                    type="button"
                    className="px-5 overflow-hidden text-sm font-bold tracking-wide rounded-sm"
                  />
                )
              }

              if (chain.unsupported) {
                return (
                  <Button
                    label="Wrong network"
                    onClick={openChainModal}
                    type="button"
                    className="px-5 overflow-hidden text-sm font-bold tracking-wide rounded-sm"
                  />
                )
              }

              return <ConnectButton />
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default CustomConnectButton
