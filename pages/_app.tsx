import { ClickToComponent } from "click-to-react-component"
import { ThemeProvider } from "next-themes"
import Head, { defaultTitle } from "@components/common/Head"
import { Background, Layout } from "@components/ui"
import "../styles/global/styles.scss"
import { AppWrapper } from "@components/ui/context"
import { AppProps } from "next/dist/shared/lib/router/router"

import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme
} from "@rainbow-me/rainbowkit"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { chain, createClient, configureChains, WagmiConfig } from "wagmi"
import "@rainbow-me/rainbowkit/styles.css"

const defaultChains =
  process.env.NEXT_PUBLIC_CHAIN_ID === "1"
    ? [chain.mainnet, chain.goerli]
    : [chain.goerli, chain.mainnet]

const { chains, provider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
  publicProvider()
])

const { connectors } = getDefaultWallets({
  appName: defaultTitle,
  chains
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ClickToComponent />
      <Head />
      <ThemeProvider
        attribute="class"
        storageKey="nightwind-mode"
        defaultTheme="system"
      >
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            chains={chains}
            theme={
              // isDark
              //   ? midnightTheme({
              //       accentColor: "#2563eb",
              //       accentColorForeground: "white",
              //       borderRadius: "medium"
              //     })
              //   :
              lightTheme({
                accentColor: "#2563eb",
                accentColorForeground: "white",
                borderRadius: "small"
              })
            }
            showRecentTransactions={true}
            coolMode
          >
            <AppWrapper>
              <Layout>
                <Background />
                <Component {...pageProps} />
              </Layout>
            </AppWrapper>
          </RainbowKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </>
  )
}

export default MyApp
