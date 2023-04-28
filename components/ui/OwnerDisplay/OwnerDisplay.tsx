import Crown from "@components/icons/Crown"
import formatAddress from "@utils/formatAddress"

type Props = {
  projectOwner: string
}

const OwnerDisplay = ({ projectOwner }: Props) => {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-4 h-4">
        <Crown />
      </div>
      <p>
        Project owner:{" "}
        <a
          href={`https://${
            process.env.NEXT_PUBLIC_CHAIN_ID == "5" ? "goerli." : ""
          }etherscan.io/address/${projectOwner}`}
          target="_blank"
          rel="noreferrer"
          className="highlight"
        >
          {formatAddress(projectOwner)}
        </a>
      </p>
    </div>
  )
}

export default OwnerDisplay
