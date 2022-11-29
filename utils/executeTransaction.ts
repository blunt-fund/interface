import { NewTransaction } from "@rainbow-me/rainbowkit/dist/transactions/transactionStore"
import { Dispatch, SetStateAction } from "react"

export type TxData = {
  transactionHash?: string
}

const executeTransaction = async (
  promise: () => Promise<any>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  txDescription?: string,
  addRecentTransaction?: (transaction: NewTransaction) => void,
  settlementLogic?: (waitData: any) => Promise<any>
) => {
  setLoading(true)

  try {
    const tx = await promise()

    if (addRecentTransaction) {
      addRecentTransaction({
        hash: tx.hash,
        description: txDescription || "Transaction executed"
      })
    }

    const waitData = await tx.wait()

    if (settlementLogic) {
      return await settlementLogic(waitData)
    }
  } catch (err) {}
  setLoading(false)
}

export default executeTransaction
