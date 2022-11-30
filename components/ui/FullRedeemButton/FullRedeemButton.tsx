import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import executeTransaction from "@utils/executeTransaction"
import { addresses } from "@utils/constants"
import { BigNumber, ethers } from "ethers"
import { useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import JBTerminal from "abi/JBETHPaymentTerminal.json"
import { Button, Question } from "../"
import { useAppContext } from "../context"

type Props = {
  projectId: number
  accountContributions: BigNumber
}

const FullRedeemButton = ({ accountContributions, projectId }: Props) => {
  const { account } = useAppContext()
  const [loading, setLoading] = useState(false)

  const allTokens = Number(ethers.utils.formatUnits(accountContributions, 3))

  const { config, error } = usePrepareContractWrite({
    address: addresses.JBTerminal,
    abi: JBTerminal.abi,
    functionName: "redeemTokensOf",
    args: [
      account,
      projectId,
      allTokens,
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
    <div className="relative flex items-center gap-3 text-left">
      <div className="flex items-center text-sm xs:text-base">
        <p className="">Redeem your contributions</p>
        <Question
          position="bottom-0 left-[-24px]"
          text={
            <>
              <p>
                Since the round ended without reaching the target, you can claim
                back the full sum contributed.
              </p>
            </>
          }
        />
      </div>
      <Button
        label="Redeem"
        loading={loading}
        onClick={async () =>
          await executeTransaction(
            writeAsync,
            setLoading,
            `Full redeem | Round ${projectId}`,
            addRecentTransaction,
            null,
            true
          )
        }
      />
    </div>
  )
}

export default FullRedeemButton
