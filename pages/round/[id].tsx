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

export default function Create() {
  const router = useRouter()
  const { id } = router.query

  const round = rounds.filter((r) => r.roundId == Number(id))[0]

  const [payment, setPayment] = useState(0)
  const [isPaymentEth, setIsPaymentEth] = useState(true)
  const [descriptionHtml, setDescriptionHtml] = useState("")

  const getDescriptionHtml = async () => {
    setDescriptionHtml(await markdownToHtml(round.description))
  }

  useEffect(() => {
    if (round?.description) {
      getDescriptionHtml()
    }
  }, [round])

  return (
    <>
      <NextSeo
        title={`${round?.name} | Blunt round | Blunt Finance`}
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
          {round && (
            <>
              <RoundViewMain
                name={round.name}
                descriptionHtml={descriptionHtml}
                image={round.image}
                website={round.website}
                twitter={round.twitter}
                discord={round.discord}
                docs={round.docs}
                tokenSymbol={round.tokenSymbol}
                tokenIssuance={0}
                duration={round.duration}
                target={round.target}
                cap={round.cap}
                isFundraiseEth={round.isFundraiseEth}
                raised={round.raised}
                reservedStake={round.reservedStake}
              />

              <PayButton
                round={round}
                payment={payment}
                setPayment={setPayment}
                isPaymentEth={isPaymentEth}
                setIsPaymentEth={setIsPaymentEth}
              />

              <div className="py-8">
                <p className="pb-8 text-base text-center">
                  Token emission (after round)
                </p>
                <div className="text-black">
                  <PieChart
                    addresses={["Contributor", "Other reserved", "Blunt round"]}
                    shares={[
                      100 - round.totalReserved,
                      Number(round.totalReserved) - Number(round.reservedStake),
                      Number(round.reservedStake)
                    ]}
                    total={100}
                  />
                </div>
              </div>

              <Locks
                transferTimestamp={round?.transferTimestamp}
                releaseTimestamp={round?.releaseTimestamp}
              />

              <div className="pb-6">
                <ReservedTable
                  reservedPool={round.totalReserved}
                  reservedStake={Number(round.reservedStake)}
                />
              </div>
            </>
          )}
        </main>
      </Container>
    </>
  )
}
