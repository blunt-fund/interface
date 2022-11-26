import { NextSeo } from "next-seo"
import {
  Container,
  EmissionPreview,
  Locks,
  PayButton,
  PieChart,
  ReservedTable,
  RoundViewMain
} from "@components/ui"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"
import { useRouter } from "next/router"
import { rounds } from "@components/ui/MyRounds/MyRounds"
import { useEffect, useState } from "react"
import markdownToHtml from "@lib/markdownToHtml"
import multicall from "@utils/multicall"
import useQuery from "@utils/subgraphQuery"
import fetcher from "@utils/fetcher"
import { constants } from "utils/constants"
import Spinner from "@components/icons/Spinner"
import useMulticall from "@utils/useMulticall"
import useRoundsMetadata from "@utils/useRoundsMetadata"
import useNow from "@utils/useNow"
import formatRoundInfo, { RoundData } from "@utils/formatRoundInfo"
import { ethers } from "ethers"

export default function Create() {
  const router = useRouter()
  const { id } = router.query

  const [payment, setPayment] = useState(0)
  const [isPaymentEth, setIsPaymentEth] = useState(true)
  const [descriptionHtml, setDescriptionHtml] = useState("")

  const getDescriptionHtml = async () => {
    setDescriptionHtml(await markdownToHtml(description))
  }

  const tokensQuery = /* GraphQL */ `
    project(
      id: "2-${id}"
    ) {
      owner
      createdAt
      metadataUri
      configureEvents {
        timestamp
        duration
        weight
        dataSource
      }
    }
  `

  let subgraphData = useQuery(tokensQuery, [id])
  const project = subgraphData?.project
  const testDelegateAddress = "0x0518a92F872e6B094491019dc0c658dB066bf16b"
  const roundInfo = useMulticall(
    testDelegateAddress, // TODO: Replace with actual delegate addresses
    "getRoundInfo()",
    "",
    [subgraphData]
  )
  const metadata = useRoundsMetadata([project])
  const now = Math.floor(useNow() / 1000)
  const { name, description, logoUri } = (metadata && metadata[0]) || {}
  const {
    totalContributions,
    target,
    cap,
    afterRoundReservedRate,
    afterRoundSplits,
    tokenName,
    tokenSymbol,
    isRoundClosed,
    isTargetEth,
    isCapEth,
    isSlicerToBeCreated,
    releaseTimeLock,
    transferTimeLock,
    projectOwner,
    fundingCycleRound,
    isQueued,
    slicerId
  } = formatRoundInfo(roundInfo && roundInfo[0])
  const roundShares =
    afterRoundSplits &&
    Math.floor((afterRoundReservedRate * afterRoundSplits[0][2]) / 1e9) / 100 // TODO: Check first split address is address(0)
  const timestamp = project?.configureEvents[0].timestamp // TODO: Figure out how to calculate this without using timestamp
  const duration = project?.configureEvents[0].duration
  const deadline = timestamp + duration - now
  const formatCurrency = (isEth: boolean, value: number) =>
    isEth ? value / 1e4 : value / 1e2

  const round: RoundData = {
    name,
    description,
    duration,
    target: formatCurrency(isTargetEth, target),
    cap: formatCurrency(isCapEth, cap),
    isTargetEth,
    isCapEth,
    isSlicerToBeCreated,
    tokenSymbol,
    tokenIssuance:
      project &&
      Number(ethers.utils.formatEther(project.configureEvents[0].weight)),
    image: {
      url: constants.ipfsGateway + String(logoUri).split("ipfs/")[1],
      file: undefined
    },
    addresses: [],
    shares: [roundShares],
    projectOwner: "",
    transferTimeLock: 0,
    releaseTimeLock: 0,
    roundTimeLock: 0,
    tokenName: "",
    website: "",
    twitter: "",
    discord: "",
    docs: "",
    metadata: "",
    fundingCycleRound: 0
  }
  const totalShares = round?.shares?.reduce((a, b) => Number(a) + Number(b))

  console.log({ roundInfo, metadata })

  useEffect(() => {
    if (description) {
      getDescriptionHtml()
    }
  }, [round])

  return (
    <>
      <NextSeo
        title={`${name} | Blunt round | Blunt Finance`}
        openGraph={{
          title: longTitle,
          description: defaultDescription,
          url: domain,
          images: [
            {
              url: `${domain}/og_image.jpg`,
              width: 1000,
              height: 1000,
              alt: `${defaultTitle} cover image`
            }
          ]
        }}
      />
      <Container page={true}>
        <main className="max-w-screen-sm mx-auto space-y-10">
          {round ? (
            <>
              <RoundViewMain
                roundData={round}
                descriptionHtml={descriptionHtml}
                raised={totalContributions}
                issuance={false}
              />

              <PayButton
                projectId={Number(id)}
                round={round}
                payment={payment}
                setPayment={setPayment}
                isPaymentEth={isPaymentEth}
                setIsPaymentEth={setIsPaymentEth}
                isSlicerToBeCreated={
                  isSlicerToBeCreated || round?.shares[0] != 0
                }
              />

              <Locks
                transferTimestamp={transferTimeLock}
                releaseTimestamp={releaseTimeLock}
                roundTimestamp={round.roundTimeLock}
              />

              <EmissionPreview
                shares={round?.shares}
                totalShares={totalShares}
              />

              {/* TODO: Add "Contributed" section */}
            </>
          ) : (
            <div className="flex justify-center">
              <Spinner size="h-12 w-12" />
            </div>
          )}
        </main>
      </Container>
    </>
  )
}
