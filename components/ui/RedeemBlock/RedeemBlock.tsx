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
  const formattedAccountContributions = Number(
    ethers.utils.formatUnits(accountContributions, 18)
  )

  return (
    <div className="space-y-2 text-sm text-right">
      <p>
        You contributed:{" "}
        <b>
          {formattedAccountContributions} ETH
          {!isRedeemDisabled && (
            <span
              className="ml-2 text-blue-600 cursor-pointer"
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
              Refund
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
