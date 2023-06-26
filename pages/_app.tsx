import Head, { defaultTitle } from "@components/common/Head"
import { Background, Layout } from "@components/ui"
import { ClickToComponent } from "click-to-react-component"
import { ThemeProvider } from "next-themes"
import "../styles/global/styles.scss"
import { AppWrapper } from "@components/ui/context"
import { Analytics } from "@vercel/analytics/react"
import { AppProps } from "next/dist/shared/lib/router/router"
import "@rainbow-me/rainbowkit/styles.css"
import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit"
import { goerli } from "viem/chains"
import { configureChains, createConfig, mainnet, WagmiConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { infuraProvider } from "wagmi/providers/infura"
import { publicProvider } from "wagmi/providers/public"

const customChains = [
  process.env.NEXT_PUBLIC_CHAIN_ID === "5" ? goerli : mainnet
]
const { chains, publicClient } = configureChains(customChains, [
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID }),
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
  publicProvider()
])

const { connectors } = getDefaultWallets({
  appName: defaultTitle,
  projectId: "2d82f7ed59eabc4af2f9216ecad01e21",
  chains
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
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
        <WagmiConfig config={wagmiConfig}>
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
      <Analytics />
    </>
  )
}

export default MyApp
