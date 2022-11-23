import {
  Input,
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
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { useAppContext } from "../context"
import { ImageType } from "../CreateFormAdvancedLinks/CreateFormAdvancedLinks"

export type RoundData = {
  name: string
  description: string
  duration: number
  target: number
  cap: number
  isTargetEth: boolean
  isCapEth: boolean
  enforceSlicerCreation: boolean
  projectOwner: string
  transferTimeLock: number
  releaseTimeLock: number
  roundTimeLock: number
  tokenName: string
  tokenSymbol: string
  tokenIssuance: number
  image: ImageType
  website: string
  twitter: string
  discord: string
  docs: string
  addresses: string[]
  shares: number[]
}

const CreateRoundForm = () => {
  const { account, setModalView } = useAppContext()
  const [uploadStep, setUploadStep] = useState(0)

  const [createRoundData, setRoundData] = useState<RoundData>({
    name: "",
    description: "",
    duration: 0,
    target: 0,
    cap: 0,
    isTargetEth: true,
    isCapEth: true,
    enforceSlicerCreation: true,
    projectOwner: account || "",
    transferTimeLock: 0,
    releaseTimeLock: 0,
    roundTimeLock: 0,
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
    addresses: [""],
    shares: [10]
  })

  // Lock
  const {
    target,
    cap,
    isTargetEth,
    isCapEth,
    duration,
    transferTimeLock,
    releaseTimeLock,
    roundTimeLock,
    shares,
    projectOwner
  } = createRoundData

  const totalShares = shares.reduce((a, b) => Number(a) + Number(b))
  const reservedError = totalShares > 100

  const normalizedTarget = useNormalizeCurrency(target, isTargetEth)
  const normalizedCap = useNormalizeCurrency(cap, isCapEth)
  const riskMargin = normalizedTarget / normalizedCap
  const targetError = cap != 0 && normalizedTarget >= normalizedCap

  // TODO: Fix this timestamp mess
  const now = new Date()
  let transferLockDate = transferTimeLock != 0 ? new Date() : new Date(0)
  let releaseLockDate = releaseTimeLock != 0 ? new Date() : new Date(0)
  let roundLockDate = roundTimeLock != 0 ? new Date() : new Date(0)

  transferLockDate.setDate(
    now.getDate() + Number(transferTimeLock) + Number(duration)
  )
  releaseLockDate.setDate(
    now.getDate() + Number(releaseTimeLock) + Number(duration)
  )
  roundLockDate.setDate(
    now.getDate() + Number(roundTimeLock) + Number(duration)
  )
  const transferTimestamp = transferLockDate.getTime()
  const releaseTimestamp = releaseLockDate.getTime()
  const roundTimestamp = roundLockDate.getTime()

  const addRecentTransaction = useAddRecentTransaction()

  // const { config } = usePrepareContractWrite({
  //   addressOrName: "BluntDelegateProjectDeployer",
  //   contractInterface: "",
  //   functionName: "launchProjectFor",
  //   args: []
  // })

  // const { writeAsync } = useContractWrite(config)

  const createRound = async () => {
    // Lock
    const { name, description, image, website, twitter, discord, docs } =
      createRoundData

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
      setUploadStep(2)
      // const tx = await writeAsync()
      // addRecentTransaction({
      //   hash: tx.hash,
      //   description: "Create Blunt round"
      // })
      // await tx.wait()
      setUploadStep(5)
    } catch (error) {
      // TODO: Handle revert
      // setUploadStep(3)
      // const cids: string[] = []
      // if (cid) cids.push(cid)
      // if (image.file) cids.push(logoCid)
      // const requestIds: string[] = await getRequestIds(cids)
      // deletePins(requestIds)
      setUploadStep(4)
    }
  }

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!reservedError && !targetError) {
      const markdownToHtml = (await import("@lib/markdownToHtml")).default
      const { description } = createRoundData
      const descriptionHtml = await markdownToHtml(description)

      setModalView({
        name: "REVIEW_ROUND_VIEW",
        cross: true,
        params: {
          createRoundData,
          descriptionHtml,
          totalShares,
          createRound,
          transferTimestamp,
          releaseTimestamp,
          roundTimestamp
        }
      })
    }
  }

  useEffect(() => {
    if (uploadStep != 0) {
      setModalView({
        cross: false,
        name: `CREATE_ROUND_VIEW`,
        params: {
          uploadStep
        }
      })
    }
  }, [uploadStep])

  return (
    <form className="space-y-8 text-left" onSubmit={submit}>
      <CreateFormGeneral
        createRoundData={createRoundData}
        setRoundData={setRoundData}
      />
      <p className="pt-4 font-bold">Advanced settings</p>
      <ul className="space-y-6">
        <CollapsibleItem
          label="Fundraise parameters"
          error={targetError}
          detail={
            <CreateFormAdvancedFundraise
              createRoundData={createRoundData}
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
              createRoundData={createRoundData}
              setRoundData={setRoundData}
            />
          }
        />
        <CollapsibleItem
          label="Vesting and locks"
          detail={
            <CreateFormAdvancedLock
              createRoundData={createRoundData}
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
              createRoundData={createRoundData}
              setRoundData={setRoundData}
            />
          }
        />
        <CollapsibleItem
          label="Reserved rate"
          error={reservedError}
          detail={
            <CreateFormAdvancedReservedRate
              createRoundData={createRoundData}
              setRoundData={setRoundData}
              totalShares={totalShares}
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
