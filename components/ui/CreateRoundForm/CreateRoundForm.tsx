import {
  Button,
  CollapsibleItem,
  CreateFormAdvancedERC20,
  CreateFormAdvancedFundraise,
  // CreateFormAdvancedLock,
  CreateFormAdvancedLinks,
  // CreateFormAdvancedReservedRate,
  CreateFormGeneral,
  ReservedTable
} from "@components/ui"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import deletePins from "@utils/deletePins"
import fetcher from "@utils/fetcher"
import getRequestIds from "@utils/getRequestIds"
import jsonToFile from "@utils/jsonToFile"
import useNormalizeCurrency from "@utils/useNormalizeCurrency"
import { constants } from "@utils/constants"
import web3Storage from "lib/web3Storage"
import React, { useEffect, useState } from "react"
import { useSigner } from "wagmi"
import { useAppContext } from "../context"
import bluntDeployer from "abi/BluntDelegateProjectDeployer.json"
import { ContractReceipt, ethers } from "ethers"
import formatDeployData from "@utils/formatDeployData"
import { addresses as addressConstants } from "utils/constants"
import { RoundData } from "@utils/getRounds"
import timeout from "@utils/timeout"
import { useConnectModal } from "@rainbow-me/rainbowkit"

const CreateRoundForm = () => {
  const { openConnectModal } = useConnectModal()
  const { account, isConnected, setModalView } = useAppContext()
  const [uploadStep, setUploadStep] = useState(0)
  const [roundId, setRoundId] = useState(0)

  const initRoundData = {
    name: "",
    description: "",
    deadline: undefined,
    target: 0,
    cap: 0,
    isTargetUsd: true,
    isHardcapUsd: true,
    isSlicerToBeCreated: true, // Unused
    projectOwner: account || "",
    transferTimelock: 0, // Unused
    releaseTimelock: 0, // Unused
    roundTimelock: 0, // Unused
    tokenName: "", // Unused
    tokenSymbol: "", // Unused
    tokenIssuance: 1000000,
    image: {
      url: "",
      file: undefined
    },
    website: "",
    twitter: "",
    discord: "",
    docs: "",
    addresses: [], // [ethers.constants.AddressZero],
    shares: [], // [10],
    metadata: ""
  }

  const [roundData, setRoundData] = useState<RoundData>(initRoundData)

  // Lock
  const {
    target,
    cap,
    isTargetUsd,
    isHardcapUsd,
    // deadline,
    // transferTimelock,
    // releaseTimelock,
    // roundTimelock,
    shares,
    projectOwner
  } = roundData

  const totalShares = shares.length
    ? shares.reduce((a, b) => Number(a) + Number(b))
    : 0
  const reservedError = totalShares > 100

  const normalizedTarget = useNormalizeCurrency(target, !isTargetUsd)
  const normalizedCap = useNormalizeCurrency(cap, !isHardcapUsd)
  const riskMargin = normalizedTarget / normalizedCap
  const targetError = cap != 0 && normalizedTarget >= normalizedCap

  // const now = new Date()
  // let transferLockDate = transferTimelock != 0 ? new Date() : new Date(0)
  // let releaseLockDate = releaseTimelock != 0 ? new Date() : new Date(0)
  // let roundLockDate = roundTimelock != 0 ? new Date() : new Date(0)

  // transferLockDate.setDate(
  //   now.getDate() + Number(transferTimelock) + Number(deadline)
  // )
  // releaseLockDate.setDate(
  //   now.getDate() + Number(releaseTimelock) + Number(deadline)
  // )
  // roundLockDate.setDate(
  //   now.getDate() + Number(roundTimelock) + Number(deadline)
  // )
  // const transferTimestamp = transferLockDate.getTime()
  // const releaseTimestamp = releaseLockDate.getTime()
  // const roundTimestamp = roundLockDate.getTime()

  const addRecentTransaction = useAddRecentTransaction()
  const { data: signer } = useSigner()

  const createRound = async () => {
    const { name, description, image, website, twitter, discord, docs } =
      roundData

    setUploadStep(1)
    let cid: string
    const logoCid = image.file
      ? await web3Storage().put([image.file], {
          wrapWithDirectory: false
        })
      : "bafkreibdtsmod77wdg2lf6n4j5kubyy7idrlc2y2td4p4x77e2t5ppbche"
    try {
      const metadataJson = {
        name,
        description,
        logoUri: constants.ipfsGateway + logoCid,
        infoUri: website,
        twitter,
        discord,
        docs
      }
      const metadata = jsonToFile(metadataJson, "metadata")
      cid = await web3Storage().put(metadata, {
        wrapWithDirectory: false,
        name
      })

      const { deployBluntDelegateData, launchProjectData } = formatDeployData(
        roundData,
        totalShares
      )
      launchProjectData.projectMetadata.content = cid

      const deployer = new ethers.Contract(
        addressConstants.BluntDelegateProjectDeployer,
        bluntDeployer.abi,
        signer
      )

      setUploadStep(2)
      const tx = await deployer.launchProjectFor(
        deployBluntDelegateData,
        launchProjectData
      )
      addRecentTransaction({
        hash: tx.hash,
        description: "Create Blunt round"
      })
      const wait: ContractReceipt = await tx.wait()

      const event = wait.events[2]

      const projectId = Number(event.topics[1])
      setRoundId(projectId)

      // Create Project in db
      const body = {
        body: JSON.stringify({
          metadataUri: cid,
          projectId,
          metadata: metadataJson
        }),
        method: "POST"
      }

      setUploadStep(5)
      fetch(`/api/rounds/create`, body)
      await timeout(2500)
      await fetch(`/api/revalidate?paths=rounds&paths=rounds/${projectId}`)

      setUploadStep(6)
      setRoundData(initRoundData)
    } catch (error) {
      console.log(error)

      // TODO: Handle revert
      // setUploadStep(3)
      // const cids: string[] = []
      // if (cid) cids.push(cid)
      // if (image.file) cids.push(logoCid)
      // const requestIds: string[] = await getRequestIds(cids)
      // console.log({ requestIds })
      // deletePins(requestIds)
      setUploadStep(4)
    }
  }

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!reservedError && !targetError) {
      const markdownToHtml = (await import("@lib/markdownToHtml")).default
      const { description } = roundData
      const descriptionHtml = await markdownToHtml(description)

      setModalView({
        name: "REVIEW_ROUND_VIEW",
        cross: true,
        params: {
          roundData,
          descriptionHtml,
          totalShares,
          createRound,
          // transferTimestamp,
          // releaseTimestamp,
          // roundTimestamp,
          projectOwner
        }
      })
    }
  }

  useEffect(() => {
    if (uploadStep != 0) {
      setModalView({
        ...{
          cross: uploadStep == 4 || uploadStep == 6,
          name: `CREATE_ROUND_VIEW`,
          params: {
            uploadStep,
            roundId
          }
        }
      })
    }
  }, [uploadStep])

  return (
    <form className="space-y-8 text-left" onSubmit={submit}>
      <CreateFormGeneral roundData={roundData} setRoundData={setRoundData} />
      <CreateFormAdvancedFundraise
        roundData={roundData}
        setRoundData={setRoundData}
        targetError={targetError}
        riskMargin={riskMargin}
      />
      <p className="pt-4 font-bold">Advanced settings</p>
      <ul className="pb-6 space-y-8">
        <CollapsibleItem
          label="Project details"
          detail={
            <CreateFormAdvancedLinks
              roundData={roundData}
              setRoundData={setRoundData}
            />
          }
        />
        <CollapsibleItem
          label="Token issuance"
          detail={
            <CreateFormAdvancedERC20
              roundData={roundData}
              setRoundData={setRoundData}
            />
          }
        />
        {/* <CollapsibleItem
          label="Reserved rate"
          error={reservedError}
          detail={
            <CreateFormAdvancedReservedRate
              roundData={roundData}
              setRoundData={setRoundData}
              totalShares={totalShares}
              projectOwner={projectOwner}
            />
          }
        /> */}
        {/* 
        <CollapsibleItem
          label="Vesting and locks"
          secondary={!roundData.isSlicerToBeCreated && shares[0] == 0}
          detail={
            <CreateFormAdvancedLock
              roundData={roundData}
              setRoundData={setRoundData}
              transferLockDate={transferLockDate}
              releaseLockDate={releaseLockDate}
              roundLockDate={roundLockDate}
            />
          }
        /> */}
      </ul>

      {/* <div className="py-8">
        <p className="pb-6 text-base font-bold text-left">
          Token emission after round (preview)
        </p>
        <div className="pb-6">
          <ReservedTable reservedPool={totalShares} reservedStake={shares[0]} />
        </div>
      </div> */}

      <div className="text-center">
        <Button
          label={!isConnected ? "Connect wallet" : "Review"}
          type={!isConnected ? "button" : "submit"}
          onClick={() => !isConnected && openConnectModal()}
        />
      </div>
    </form>
  )
}

export default CreateRoundForm
