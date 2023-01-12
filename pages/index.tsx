import { NextSeo } from "next-seo"
import { Button, Container } from "@components/ui"
import {
  defaultDescription,
  defaultTitle,
  longTitle,
  domain
} from "@components/common/Head"

export default function Home() {
  return (
    <>
      <NextSeo
        title="Blunt Finance | Manage terms sheets, fundraising, cashflow, and capital allocation, bluntly in the open with your community."
        openGraph={{
          title: longTitle,
          description: defaultDescription,
          url: domain,
          images: [
            {
              url: `${domain}/og_image.png`,
              width: 1000,
              height: 1000,
              alt: `${defaultTitle} cover image`
            }
          ]
        }}
      />
      <Container page={true}>
        <main className="max-w-screen-sm mx-auto space-y-10">
          <h1>Blunt Finance</h1>
          <p className="sm:text-lg">
            Fundraise bluntly in the open with your community
          </p>
          <Button label="Create round" href="/create" />
        </main>
      </Container>
    </>
  )
}
