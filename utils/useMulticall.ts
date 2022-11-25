import { useEffect, useState } from "react"
import multicall from "./multicall"

const useMulticall = (
  to: string | string[],
  functionSignature: string,
  args: string,
  deps?: any[]
) => {
  const [data, setData] = useState<any[]>()

  useEffect(() => {
    const getData = async () => {
      const results = await multicall(to, functionSignature, args)
      setData(results)
    }

    if (deps) {
      getData()
    }
  }, deps)

  return data
}

export default useMulticall
