import { BigNumber, ethers } from "ethers"
import { useAppContext } from "../context"

type Props = {
  projectId: number
  totalContributions: number
  accountContributions: BigNumber
  tokenIssuance: number
  isRedeemDisabled: boolean
}

const RedeemBlock = ({
  projectId,
  totalContributions,
  accountContributions,
  tokenIssuance,
  isRedeemDisabled
}: Props) => {
  const { setModalView } = useAppContext()
  const formattedAccountContributions =
    Math.round(
      Number(ethers.utils.formatUnits(accountContributions, 18)) * 1000
    ) / 1000

  return (
    <div className="space-y-2 text-sm text-right">
      <p>
        You contributed:{" "}
        <b>
          {formattedAccountContributions} ETH
          {!isRedeemDisabled && (
            <span
              className="ml-3 text-blue-600 cursor-pointer"
              onClick={() =>
                setModalView({
                  name: "REDEEM_VIEW",
                  cross: true,
                  params: {
                    projectId,
                    formattedAccountContributions,
                    totalContributions,
                    tokenIssuance
                  }
                })
              }
            >
              Get refund
            </span>
          )}
        </b>
      </p>
      {/* <p>
        Blunt allocation:{" "}
        <b>
          {Math.floor(
            (formattedAccountContributions / totalContributions) * 1e4
          ) / 100}
          %
        </b>
      </p> */}
    </div>
  )
}

export default RedeemBlock
