import { NextSeo } from "next-seo"
import { Container, RoundViewMain } from "@components/ui"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"
import { useRouter } from "next/router"

export default function Create() {
  const router = useRouter()
  const { id } = router.query

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
          <h1>Blunt round #{id}</h1>
          <RoundViewMain
            name={"Test"}
            descriptionHtml={""}
            image={{ url: "", file: undefined }}
            website={""}
            twitter={"@jj_ranalli"}
            discord={""}
            docs={""}
            tokenSymbol={"TEST"}
            tokenIssuance={12345}
            duration={21}
            target={123}
            cap={456}
            isFundraiseEth={true}
          />
        </main>
      </Container>
    </>
  )
}
