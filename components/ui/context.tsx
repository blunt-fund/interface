import { createContext, useContext, useEffect, useState } from "react"
import { View } from "@lib/content/modals"
import { useAccount, useProvider } from "wagmi"

const AppContext = createContext<any>({
  connector: null,
  provider: null,
  account: "",
  isConnected: false,
  modalView: { name: "" },
  setModalView: () => null
})

export function AppWrapper({ children }) {
  const [modalView, setModalView] = useState<View>({ name: "" })
  const [isConnected, setIsConnected] = useState(false)
  const provider = useProvider()
  const { address, connector } = useAccount()

  useEffect(() => {
    setIsConnected(address && true)
  }, [address])

  return (
    <AppContext.Provider
      value={{
        connector,
        provider,
        account: address,
        isConnected,
        modalView,
        setModalView
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}

const TimeContext = createContext<any>({
  now: Math.floor(new Date().getTime() / 1000)
})

export function TimeWrapper({ children }) {
  const [time, setTime] = useState(Math.floor(new Date().getTime() / 1000))

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((time) => time + 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <TimeContext.Provider value={{ now: time }}>
      {children}
    </TimeContext.Provider>
  )
}

export function useTimeContext() {
  return useContext(TimeContext)
}
