import { RoundViewFull } from ".."
import { Project } from "@prisma/client"
import { useAppContext } from "../context"
import bluntDelegateJson from "abi/BluntDelegateClone.json"
import { useContractReads } from "wagmi"
import { ethers } from "ethers"
import { useEffect, useState } from "react"

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
