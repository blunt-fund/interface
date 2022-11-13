import getSelector from "./getSelector"
import defaultProvider from "./defaultProvider"

const multicall = async (
  to: string | string[],
  functionSignature: string,
  args: string
) => {
  const promises = []
  const selector = getSelector(functionSignature)

  const data = selector + args
  if (typeof to === "string") {
    promises.push(
      defaultProvider.call({
        to,
        data
      })
    )
  } else {
    to.forEach((callAddress) => {
      promises.push(
        defaultProvider.call({
          to: callAddress,
          data
        })
      )
    })
  }

  const results = await Promise.all(promises.map((p) => p.catch(() => "")))

  return results
}

export default multicall
