import { useEns } from "@utils/resolveEns"

const ResolvedAddress = ({ address }: { address: `0x${string}` }) => {
  const resolved = useEns(address)

  return (
    <>
      {resolved ||
        address.replace(
          address.substring(5, address.length - 3),
          `\xa0\xa0\xa0`
        )}
    </>
  )
}

export default ResolvedAddress
