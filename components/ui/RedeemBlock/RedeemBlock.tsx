import formatNumber from "@utils/formatNumber"
import { BigNumber, ethers } from "ethers"
import { useEffect, useState } from "react"
import { useAppContext } from "../context"

type Props = {
  projectId: number
  totalContributions: number
  accountContributions: BigNumber
  tokenIssuance: number
}

const RedeemBlock = ({
  projectId,
  totalContributions,
  accountContributions,
  tokenIssuance
}: Props) => {
  const { setModalView } = useAppContext()
  const [show, setShow] = useState(false)
  const formattedAccountContributions = Number(
    ethers.utils.formatUnits(accountContributions, 18)
  )

  useEffect(() => {
    setShow(Number(accountContributions) != 0)
  }, [accountContributions])

  return (
    show && (
      <div className="space-y-2 text-sm text-left">
        <p>
          You contributed:{" "}
          <b>
            {formattedAccountContributions} ETH{" "}
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
              Redeem
            </span>
          </b>
        </p>
        <p>
          Slices to receive:{" "}
          <b>
            {formatNumber(Math.round(formattedAccountContributions * 1000))}
          </b>{" "}
          (
          {Math.floor(
            (formattedAccountContributions / totalContributions) * 1e4
          ) / 100}
          % of round allocation)
        </p>
      </div>
    )
  )
}

export default RedeemBlock
