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
import constants from "constants.json"

export default function Create() {
  const router = useRouter()
  const { id } = router.query

  const roundData = rounds.filter((r) => r.roundId == Number(id))[0]
  const {
    name,
    description,
    transferTimeLock,
    releaseTimeLock,
    roundTimeLock,
    shares,
    raised,
    enforceSlicerCreation
  } = roundData || {}
  const totalShares = shares?.reduce((a, b) => Number(a) + Number(b))

  const [payment, setPayment] = useState(0)
  const [isPaymentEth, setIsPaymentEth] = useState(true)
  const [descriptionHtml, setDescriptionHtml] = useState("")

  const getDescriptionHtml = async () => {
    setDescriptionHtml(await markdownToHtml(description))
  }

  useEffect(() => {
    if (description) {
      getDescriptionHtml()
    }
  }, [roundData])

  // TODO: Add subgraph fetch
  // const tokensQuery = /* GraphQL */ `
  //     project(id: "${id}") {
  //       ...
  //     }
  //   `
  // let subgraphData = useQuery(tokensQuery)

  // TODO: Add on-chain fetch
  // const [roundInfo, setRoundInfo] = useState(null)

  // useEffect(() => {
  //   const getRoundInfo = async () => {
  //     const [cid, bluntDelegate] = subgraphData.map(
  //       ({ cid, bluntDelegateAddress }) => [cid, bluntDelegateAddress]
  //     )

  //     const [metadata, info] = await Promise.all([
  //       fetcher(constants.ipfsGateway + cid),
  //       multicall(bluntDelegate, "getRoundInfo()", "")
  //     ])

  //     setRoundInfo({ metadata, info })
  //   }

  //   if (subgraphData) {
  //     getRoundInfo()
  //   }
  // }, [subgraphData])

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
          {roundData && (
            <>
              <RoundViewMain
                roundData={roundData}
                descriptionHtml={descriptionHtml}
                raised={raised}
                issuance={false}
              />

              <PayButton
                round={roundData}
                payment={payment}
                setPayment={setPayment}
                isPaymentEth={isPaymentEth}
                setIsPaymentEth={setIsPaymentEth}
                isSlicerToBeCreated={enforceSlicerCreation || shares[0] != 0}
              />

              <Locks
                transferTimestamp={transferTimeLock}
                releaseTimestamp={releaseTimeLock}
                roundTimestamp={roundTimeLock}
              />

              <EmissionPreview shares={shares} totalShares={totalShares} />

              {/* TODO: Add "Contributed" section */}
            </>
          )}
        </main>
      </Container>
    </>
  )
}
