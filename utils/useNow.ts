import { useEffect, useState } from "react"

const useNow = () => {
  const [time, setTime] = useState(new Date().getTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().getTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return time
}

export default useNow
