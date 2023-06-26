import { Project } from "@prisma/client"
import bluntDelegateJson from "abi/BluntDelegateClone.json"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useContractReads } from "wagmi"
import { RoundViewFull } from ".."
import { useAppContext } from "../context"

type Props = {
  projectData: Project
  subgraphData: any
}

const RoundViewFullWrapper = ({ projectData, subgraphData }: Props) => {
  const { account } = useAppContext()
  const [showRound, setShowRound] = useState(false)

  const {
    data: roundInfo,
    isError,
    isLoading
  } = useContractReads({
    contracts: [
      {
        address: subgraphData?.configureEvents[0].dataSource,
        // @ts-ignore
        abi: bluntDelegateJson.abi,
        functionName: "getRoundInfo"
      },
      {
        address: subgraphData?.configureEvents[0].dataSource,
        // @ts-ignore
        abi: bluntDelegateJson.abi,
        functionName: "contributions",
        args: [account || ethers.constants.AddressZero]
      }
    ],
    watch: true
  })

  useEffect(() => {
    if (!showRound) {
      setShowRound(roundInfo?.length > 1)
    }
  }, [showRound, roundInfo])

  return (
    showRound && (
      <RoundViewFull
        projectData={projectData}
        subgraphData={subgraphData}
        roundInfo={roundInfo}
      />
    )
  )
}

export default RoundViewFullWrapper
