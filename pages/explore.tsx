import { NextSeo } from "next-seo"
import { Container, AllRounds } from "@components/ui"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"

export default function Explore() {
  return (
    <>
      <NextSeo
        title="Explore rounds | Blunt Finance"
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
        <main className="max-w-screen-sm mx-auto">
          <h1 className="pb-20">Blunt rounds</h1>
          <AllRounds />
        </main>
      </Container>
    </>
  )
}
