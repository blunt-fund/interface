import { NextSeo } from "next-seo"
import { Container, RoundViewMain } from "@components/ui"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"
import { useRouter } from "next/router"
import { rounds } from "@components/ui/MyRounds/MyRounds"

export default function Create() {
  const router = useRouter()
  const { id } = router.query

  const round = rounds.filter((r) => r.roundId == Number(id))[0]

  return (
    <>
      <NextSeo
        title={`Blunt round #${id} | Blunt Finance`}
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
            <RoundViewMain
              name={round.name}
              descriptionHtml={round.descriptionHtml}
              image={round.image}
              website={round.website}
              twitter={round.twitter}
              discord={round.discord}
              docs={round.docs}
              tokenSymbol={round.tokenSymbol}
              tokenIssuance={round.tokenIssuance}
              duration={round.duration}
              target={round.target}
              cap={round.cap}
              isFundraiseEth={round.isFundraiseEth}
              raised={round.raised}
            />
          )}
        </main>
      </Container>
    </>
  )
}
