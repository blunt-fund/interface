import {
  Input,
  Button,
  CollapsibleItem,
  CreateFormAdvancedERC20,
  CreateFormAdvancedFundraise,
  CreateFormAdvancedLock,
  CreateFormAdvancedLinks,
  CreateFormAdvancedReservedRate,
  ReservedTable,
  Textarea
} from "@components/ui"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import deletePin from "@utils/deletePin"
import jsonToFile from "@utils/jsonToFile"
import constants from "constants.json"
import web3Storage from "lib/web3Storage"
import React, { useEffect, useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { useAppContext } from "../context"
import { ImageType } from "../CreateFormAdvancedLinks/CreateFormAdvancedLinks"

const CreateRoundForm = () => {
  const { setModalView } = useAppContext()
  const [uploadStep, setUploadStep] = useState(0)

  // General settings
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [reservedStake, setReservedStake] = useState(10)

  // Advanced settings

  // Fundraise
  const [duration, setDuration] = useState(0)
  const [target, setTarget] = useState(0)
  const [isFundraiseEth, setIsFundraiseEth] = useState(true)
  const [cap, setCap] = useState(0)

  // Lock
  const [transferTimeLock, setTransferTimeLock] = useState(0)
  const [releaseTimeLock, setReleaseTimeLock] = useState(0)
  const now = new Date()
  let transferLockDate = transferTimeLock != 0 ? new Date() : new Date(0)
  let releaseLockDate = releaseTimeLock != 0 ? new Date() : new Date(0)

  transferLockDate.setDate(
    now.getDate() + Number(transferTimeLock) + Number(duration)
  )
  releaseLockDate.setDate(
    now.getDate() + Number(releaseTimeLock) + Number(duration)
  )
  const transferTimestamp = transferLockDate.getTime()
  const releaseTimestamp = releaseLockDate.getTime()

  // TODO: Fix this timestamp mess

  // ERC20
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenIssuance, setTokenIssuance] = useState(0)

  // Links
  const [image, setImage] = useState<ImageType>({
    url: "",
    file: undefined
  })
  const [website, setWebsite] = useState("")
  const [twitter, setTwitter] = useState("")
  const [discord, setDiscord] = useState("")
  const [docs, setDocs] = useState("")

  // Reserved rate
  const [targetError, setTargetError] = useState(false)
  const [reservedError, setReservedError] = useState(false)
  const [addresses, setAddresses] = useState([""])
  const [shares, setShares] = useState([100])
  const [totalShares, setTotalShares] = useState(10)

  const addRecentTransaction = useAddRecentTransaction()
  const { config } = usePrepareContractWrite({
    addressOrName: "BluntDelegateProjectDeployer",
    contractInterface: "",
    functionName: "launchProjectFor",
    args: []
  })

  const { writeAsync } = useContractWrite(config)

  const createRound = async () => {
    setUploadStep(1)
    // let cid: string
    // const logoCid = image.file
    //   ? await web3Storage().put([image.file])
    //   : "bafybeicztnsvwbgvtkohk6fu354thww6ytha7l4klkykhazhth2ftvh5su/og_image.jpg"
    try {
      // const metadata = jsonToFile(
      //   {
      //     name,
      //     description,
      //     logoUri: constants.ipfsGateway + logoCid,
      //     website,
      //     twitter,
      //     discord,
      //     docs
      //   },
      //   "metadata"
      // )

      // cid = await web3Storage().put(metadata)

      setUploadStep(2)
      // const tx = await writeAsync()
      // addRecentTransaction({
      //   hash: tx.hash,
      //   description: "Create Blunt round"
      // })
      // await tx.wait()

      if (tokenSymbol) {
        setUploadStep(3)
        // TODO: Add issue token?
      }
      setUploadStep(4)
    } catch (error) {
      setUploadStep(5)

      // if (cid) {
      //   deletePin(cid)
      // }
      // if (image.file) {
      //   deletePin(logoCid)
      // }
      setUploadStep(6)
    }
  }

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!reservedError && !targetError) {
      const markdownToHtml = (await import("@lib/markdownToHtml")).default
      const descriptionHtml = await markdownToHtml(description)

      setModalView({
        name: "REVIEW_ROUND_VIEW",
        cross: true,
        params: {
          name,
          tokenSymbol,
          tokenIssuance,
          reservedStake,
          description,
          descriptionHtml,
          image,
          website,
          twitter,
          discord,
          docs,
          duration,
          target,
          isFundraiseEth,
          cap,
          transferTimestamp,
          releaseTimestamp,
          reservedError,
          addresses,
          shares,
          totalShares,
          createRound
        }
      })
    }
  }

  useEffect(() => {
    let items = shares
    items[0] = reservedStake
    setShares(items)

    setTotalShares(
      shares.length > 1
        ? Number(shares.slice(1).reduce((a, b) => Number(a) + Number(b))) +
            Number(reservedStake)
        : Number(reservedStake)
    )
  }, [reservedStake])

  useEffect(() => {
    if (uploadStep != 0) {
      setModalView({
        cross: false,
        name: `CREATE_ROUND_VIEW`,
        params: {
          name,
          uploadStep,
          tokenSymbol,
          tokenIssuance,
          reservedStake,
          description,
          image,
          website,
          twitter,
          discord,
          docs,
          duration,
          target,
          isFundraiseEth,
          cap,
          transferTimestamp,
          releaseTimestamp,
          reservedError,
          addresses,
          shares,
          totalShares
        }
      })
    }
  }, [uploadStep])

  return (
    <form className="space-y-8 text-left" onSubmit={submit}>
      <div>
        <Input label="Project name" value={name} onChange={setName} required />
      </div>
      <div>
        <Textarea
          label="Project description"
          value={description}
          onChange={setDescription}
          rows={5}
          required
        />
      </div>
      <div className="pb-6">
        <Input
          type="range"
          label={
            <>
              Round token allocation: <b>{Number(reservedStake).toFixed(1)}%</b>
            </>
          }
          min={0}
          max={100 - Number(totalShares) + Number(reservedStake)}
          step={0.5}
          value={reservedStake}
          onChange={setReservedStake}
          question={
            <>
              Percentage of future issued tokens shared between the round
              participants.
            </>
          }
        />
      </div>

      <p className="pt-4 font-bold">Advanced settings</p>
      <ul className="space-y-6">
        <CollapsibleItem
          label="Fundraise duration, target and cap"
          error={targetError}
          detail={
            <CreateFormAdvancedFundraise
              duration={duration}
              target={target}
              isFundraiseEth={isFundraiseEth}
              cap={cap}
              targetError={targetError}
              setDuration={setDuration}
              setTarget={setTarget}
              setIsFundraiseEth={setIsFundraiseEth}
              setCap={setCap}
              setTargetError={setTargetError}
            />
          }
        />
        <CollapsibleItem
          label="Vesting"
          detail={
            <CreateFormAdvancedLock
              transferTimeLock={transferTimeLock}
              releaseTimeLock={releaseTimeLock}
              transferLockDate={transferLockDate}
              releaseLockDate={releaseLockDate}
              setTransferTimeLock={setTransferTimeLock}
              setReleaseTimeLock={setReleaseTimeLock}
            />
          }
        />
        <CollapsibleItem
          label="ERC20 token issuance"
          detail={
            <CreateFormAdvancedERC20
              name={name}
              tokenSymbol={tokenSymbol}
              tokenIssuance={tokenIssuance}
              setTokenSymbol={setTokenSymbol}
              setTokenIssuance={setTokenIssuance}
            />
          }
        />
        <CollapsibleItem
          label="Project logo and links"
          detail={
            <CreateFormAdvancedLinks
              name={name}
              image={image}
              website={website}
              twitter={twitter}
              discord={discord}
              docs={docs}
              setWebsite={setWebsite}
              setTwitter={setTwitter}
              setDiscord={setDiscord}
              setDocs={setDocs}
              setImage={setImage}
            />
          }
        />
        <CollapsibleItem
          label="Reserved rate"
          error={reservedError}
          detail={
            <CreateFormAdvancedReservedRate
              addresses={addresses}
              shares={shares}
              reservedStake={reservedStake}
              totalShares={totalShares}
              setAddresses={setAddresses}
              setShares={setShares}
              setTotalShares={setTotalShares}
              setReservedError={setReservedError}
            />
          }
        />
      </ul>

      <div className="py-8">
        <p className="pb-6 text-base font-bold text-left">
          Token emission preview
        </p>
        <div className="pb-6">
          <ReservedTable
            reservedPool={totalShares}
            reservedStake={Number(reservedStake)}
          />
        </div>
      </div>

      <div className="text-center">
        <Button label="Review" type="submit" />
      </div>
    </form>
  )
}

export default CreateRoundForm
