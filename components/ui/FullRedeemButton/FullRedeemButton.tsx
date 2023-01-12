import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import executeTransaction from "@utils/executeTransaction"
import { addresses } from "@utils/constants"
import { BigNumber, ethers } from "ethers"
import { useState } from "react"
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite
} from "wagmi"
import JBTerminal from "abi/JBETHPaymentTerminal.json"
import JBTokenStore from "abi/JBTokenStore.json"
import { Button, Question } from "../"
import { useAppContext } from "../context"

type Props = {
  projectId: number
  accountContributions: BigNumber
}

const FullRedeemButton = ({ accountContributions, projectId }: Props) => {
  const { account } = useAppContext()
  const [loading, setLoading] = useState(false)

  const formattedAccountContributions = Number(
    ethers.utils.formatEther(accountContributions)
  )

  // TODO: Make this independent from total tokens owned, and calculate based on accountsContributions and tokenIssuance
  const { data: tokenCountAll } = useContractRead({
    address: addresses.JBTokenStore,
    abi: JBTokenStore.abi,
    functionName: "balanceOf",
    args: [account, projectId]
  })

  const { config, isSuccess } = usePrepareContractWrite({
    address: addresses.JBTerminal,
    abi: JBTerminal.abi,
    functionName: "redeemTokensOf",
    args: [
      account,
      projectId,
      tokenCountAll || 0,
      ethers.constants.AddressZero,
      0,
      account,
      "Redeemed from blunt.finance",
      []
    ]
  })
  const addRecentTransaction = useAddRecentTransaction()
  const { writeAsync } = useContractWrite(config)

  return (
    isSuccess && (
      <div className="relative flex items-center gap-3 text-left">
        <div className="flex items-center text-sm xs:text-base">
          <p>Get contributions refunded</p>
          <Question
            text={
              <>
                <p>
                  Since the round ended without reaching the target, you can
                  claim back the full sum contributed.
                </p>
              </>
            }
          />
        </div>
        <Button
          label={`Get ${formattedAccountContributions} ETH`}
          loading={loading}
          onClick={async () =>
            await executeTransaction(
              writeAsync,
              setLoading,
              `Full refund | Round ${projectId}`,
              addRecentTransaction,
              null,
              true
            )
          }
        />
      </div>
    )
  )
}

export default FullRedeemButton
