import {
  Button,
  CollapsibleItem,
  CreateFormAdvancedERC20,
  CreateFormAdvancedFundraise,
  CreateFormAdvancedLock,
  CreateFormAdvancedLinks,
  CreateFormAdvancedReservedRate,
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
import { ImageType } from "../CreateFormAdvancedLinks/CreateFormAdvancedLinks"
import bluntDeployer from "abi/BluntDelegateProjectDeployer.json"
import { ContractReceipt, ethers } from "ethers"
import formatDeployData from "@utils/formatDeployData"
import { addresses as addressConstants } from "utils/constants"
import { RoundData } from "@utils/getRounds"

const CreateRoundForm = () => {
  const { account, setModalView } = useAppContext()
  const [uploadStep, setUploadStep] = useState(0)
  const [roundId, setRoundId] = useState(0)

  const [roundData, setRoundData] = useState<RoundData>({
    name: "",
    description: "",
    duration: 0,
    target: 0,
    cap: 0,
    isTargetEth: true,
    isCapEth: true,
    isSlicerToBeCreated: true,
    projectOwner: account || "",
    transferTimelock: 0,
    releaseTimelock: 0,
    roundTimelock: 0,
    tokenName: "",
    tokenSymbol: "",
    tokenIssuance: 0,
    image: {
      url: "",
      file: undefined
    },
    website: "",
    twitter: "",
    discord: "",
    docs: "",
    addresses: [ethers.constants.AddressZero],
    shares: [10],
    metadata: ""
  })

  // Lock
  const {
    target,
    cap,
    isTargetEth,
    isCapEth,
    duration,
    transferTimelock,
    releaseTimelock,
    roundTimelock,
    shares,
    projectOwner
  } = roundData

  const totalShares = shares.reduce((a, b) => Number(a) + Number(b))
  const reservedError = totalShares > 100

  const normalizedTarget = useNormalizeCurrency(target, isTargetEth)
  const normalizedCap = useNormalizeCurrency(cap, isCapEth)
  const riskMargin = normalizedTarget / normalizedCap
  const targetError = cap != 0 && normalizedTarget >= normalizedCap

  // TODO: Fix this timestamp mess
  const now = new Date()
  let transferLockDate = transferTimelock != 0 ? new Date() : new Date(0)
  let releaseLockDate = releaseTimelock != 0 ? new Date() : new Date(0)
  let roundLockDate = roundTimelock != 0 ? new Date() : new Date(0)

  transferLockDate.setDate(
    now.getDate() + Number(transferTimelock) + Number(duration)
  )
  releaseLockDate.setDate(
    now.getDate() + Number(releaseTimelock) + Number(duration)
  )
  roundLockDate.setDate(
    now.getDate() + Number(roundTimelock) + Number(duration)
  )
  const transferTimestamp = transferLockDate.getTime()
  const releaseTimestamp = releaseLockDate.getTime()
  const roundTimestamp = roundLockDate.getTime()

  const addRecentTransaction = useAddRecentTransaction()
  const { data: signer } = useSigner()

  const createRound = async () => {
    // Lock
    const { name, description, image, website, twitter, discord, docs } =
      roundData

    setUploadStep(1)
    let cid: string
    const logoCid = image.file
      ? await web3Storage().put([image.file], {
          wrapWithDirectory: false
        })
      : "bafkreienba5ag3lv7uwfkqjonxqfm2sqfzddmekjhgulnslaksfxz3y4eu"
    try {
      const metadata = jsonToFile(
        {
          name,
          description,
          logoUri: constants.ipfsGateway + logoCid,
          website,
          twitter,
          discord,
          docs
        },
        "metadata"
      )
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
        launchProjectData,
        false
      )
      addRecentTransaction({
        hash: tx.hash,
        description: "Create Blunt round"
      })
      const wait: ContractReceipt = await tx.wait()
      const events = wait.events
      setRoundId(Number(events[1].topics[1]))

      setUploadStep(5)
    } catch (error) {
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
          transferTimestamp,
          releaseTimestamp,
          roundTimestamp,
          projectOwner
        }
      })
    }
  }

  useEffect(() => {
    if (uploadStep != 0) {
      setModalView({
        ...{
          cross: uploadStep > 3,
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
      <p className="pt-4 font-bold">Advanced settings</p>
      <ul className="space-y-6">
        <CollapsibleItem
          label="Fundraise parameters"
          error={targetError}
          detail={
            <CreateFormAdvancedFundraise
              roundData={roundData}
              setRoundData={setRoundData}
              targetError={targetError}
              riskMargin={riskMargin}
            />
          }
        />
        <CollapsibleItem
          label="ERC20 token issuance"
          detail={
            <CreateFormAdvancedERC20
              roundData={roundData}
              setRoundData={setRoundData}
            />
          }
        />
        <CollapsibleItem
          label="Vesting and locks"
          detail={
            <CreateFormAdvancedLock
              roundData={roundData}
              setRoundData={setRoundData}
              transferLockDate={transferLockDate}
              releaseLockDate={releaseLockDate}
              roundLockDate={roundLockDate}
            />
          }
        />
        <CollapsibleItem
          label="Project logo and links"
          detail={
            <CreateFormAdvancedLinks
              roundData={roundData}
              setRoundData={setRoundData}
            />
          }
        />
        <CollapsibleItem
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
        />
      </ul>

      <div className="py-8">
        <p className="pb-6 text-base font-bold text-left">
          Token emission after round (preview)
        </p>
        <div className="pb-6">
          <ReservedTable reservedPool={totalShares} reservedStake={shares[0]} />
        </div>
      </div>

      <div className="text-center">
        <Button label="Review" type="submit" />
      </div>
    </form>
  )
}

export default CreateRoundForm
