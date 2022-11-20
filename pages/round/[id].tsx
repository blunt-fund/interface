import { NextSeo } from "next-seo"
import {
  Container,
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
    shares,
    raised
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
        <main className="max-w-screen-sm mx-auto space-y-10 ">
          {roundData && (
            <>
              <RoundViewMain
                roundData={roundData}
                descriptionHtml={descriptionHtml}
                raised={raised}
              />

              <PayButton
                round={roundData}
                payment={payment}
                setPayment={setPayment}
                isPaymentEth={isPaymentEth}
                setIsPaymentEth={setIsPaymentEth}
              />

              <div className="py-8">
                <p className="pb-8 text-base text-center">
                  Token emission (after blunt round)
                </p>
                <div className="text-black">
                  <PieChart
                    addresses={["Contributor", "Other reserved", "Blunt round"]}
                    shares={[
                      100 - totalShares,
                      ...shares.slice(1),
                      Number(shares[0])
                    ]}
                    total={100}
                  />
                </div>
              </div>
              {/* TODO: Add "Contributed" section */}

              <Locks
                transferTimestamp={transferTimeLock}
                releaseTimestamp={releaseTimeLock}
              />

              <div className="pb-6">
                <ReservedTable
                  reservedPool={totalShares}
                  reservedStake={Number(shares[0])}
                />
              </div>
            </>
          )}
        </main>
      </Container>
    </>
  )
}
